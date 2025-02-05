import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github'
import { Document } from '@langchain/core/documents'
import { generateEmbedding, summarizeCode } from './gemini'
import { db } from '~/server/db'

export async function LoadGitRepo({ gitUrl, gitToken }: { gitUrl: string, gitToken?: string }) {
    // Try multiple common branch names
    const possibleBranches = ['master', 'main', 'develop', 'development'];

    for (const branch of possibleBranches) {
        try {
            const loader = new GithubRepoLoader(gitUrl, {
                accessToken: gitToken || process.env.GITHUB_TOKEN,
                ignoreFiles: [".gitignore", ".gitattributes", ".git/", "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "pnpm-workspace.yaml", "bun.lockb", "node_modules", ".DS_Store", "venv",
                    ".env", "**/.svg", "**/*.svg", "**/icons/**", "**/images/**"],
                branch: branch,
                recursive: true,
                unknown: "warn",
                maxConcurrency: 10
            });

            const docs = await loader.load();

            // If docs are loaded successfully, return them
            if (docs.length > 0) {
                console.log(`Successfully loaded repository from branch: ${branch}`);
                return docs;
            }
        } catch (error) {
            console.warn(`Failed to load repository from branch ${branch}:`, error);
            // Continue to next branch
            continue;
        }
    }

    // If no branch works, throw a comprehensive error
    throw new Error(`Unable to load repository. Possible issues:
1. Repository does not exist
2. No accessible branches
3. Invalid GitHub URL
4. Authentication failure
Please check your repository URL and access token.`);
}
const generateEmbeddings = async (docs: Document[]) => {
    // Filter out SVG files before generating embeddings
    const nonSvgDocs = docs.filter(doc =>
        !doc.metadata.source.toLowerCase().endsWith('.svg') &&
        !doc.metadata.source.includes('/icons/') &&
        !doc.metadata.source.includes('/images/')
    );

    return await Promise.all(nonSvgDocs.map(async (doc) => {
        const codeSummary = await summarizeCode(doc)
        const embedding = await generateEmbedding(codeSummary)
        return {
            codeSummary,
            embedding,
            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
            fileName: doc.metadata.source
        }
    }))
}
export async function indexGitRepo({ gitUrl, gitToken, projectId }: { gitUrl: string, gitToken?: string, projectId: string }) {
    try {
        await db.$connect();
    } catch (connectionError) {
        console.error(`Failed to establish database connection for project ${projectId}:`, connectionError);
        return [];
    }
    try {
        const docs = await LoadGitRepo({ gitUrl, gitToken });

        // If no documents are loaded, log and return early
        if (docs.length === 0) {
            console.warn(`No documents loaded for project ${projectId} from ${gitUrl}`);
            return [];
        }

        // Filter out SVG and large files
        const processableDocs = docs.filter(doc =>
            !doc.metadata.source.toLowerCase().endsWith('.svg') &&
            !doc.metadata.source.includes('/icons/') &&
            !doc.metadata.source.includes('/images/'));

        if (processableDocs.length === 0) {
            console.warn(`No processable documents for project ${projectId} from ${gitUrl}`);
            return [];
        }

        const embeddings = [];
        const maxConcurrentEmbeddings = 5; // Limit concurrent API calls

        // Process embeddings in batches to avoid rate limiting
        for (let i = 0; i < processableDocs.length; i += maxConcurrentEmbeddings) {
            const batchDocs = processableDocs.slice(i, i + maxConcurrentEmbeddings);

            try {
                const batchEmbeddings = await Promise.all(batchDocs.map(async (doc) => {
                    try {
                        const codeSummary = await summarizeCode(doc);
                        const embedding = await generateEmbedding(codeSummary);

                        return {
                            codeSummary,
                            embedding,
                            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
                            fileName: doc.metadata.source
                        };
                    } catch (embeddingError) {
                        console.warn(`Failed to generate embedding for ${doc.metadata.source}:`, embeddingError);
                        return null;
                    }
                }));

                // Filter out null results and add to embeddings
                embeddings.push(...batchEmbeddings.filter(e => e !== null));
            } catch (batchError) {
                console.error(`Error processing embedding batch:`, batchError);
            }
        }

        if (embeddings.length === 0) {
            console.warn(`No embeddings generated for project ${projectId}`);
            return [];
        }

        const embeddingResults = [];
        const batchSize = 10; // Configurable batch size for database operations

        // Process embeddings in batches to reduce database connection pressure
        for (let i = 0; i < embeddings.length; i += batchSize) {
            const batchEmbeddings = embeddings.slice(i, i + batchSize);
            
            const batchResults = await Promise.allSettled(batchEmbeddings.map(async (embeddingData) => {
                try {
                    const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
                        data: {
                            projectId,
                            summary: embeddingData.codeSummary || 'No summary generated',
                            sourceCode: embeddingData.sourceCode,
                            fileName: embeddingData.fileName
                        }
                    });

                    // Update embedding vector separately
                    await db.$executeRaw`
                        UPDATE "SourceCodeEmbedding"
                        SET "summaryEmbedding" = ${embeddingData.embedding}::vector
                        WHERE id = ${sourceCodeEmbedding.id};
                    `;

                    return sourceCodeEmbedding;
                } catch (createError) {
                    console.error(`Failed to create embedding for file ${embeddingData.fileName}:`, createError);
                    return null;
                }
            }));

            // Add successful batch results to embeddingResults
            embeddingResults.push(...batchResults.filter(result => 
                result.status === 'fulfilled' && result.value !== null
            ).map(result => (result as PromiseFulfilledResult<any>).value));
        }

        // Log any failed embedding creations
        const failedCount = embeddings.length - embeddingResults.length;
        if (failedCount > 0) {
            console.warn(`${failedCount} embeddings failed to create for project ${projectId}`);
        }

        return embeddingResults;

    } catch (error) {
        console.error(`Complete indexing failed for project ${projectId}:`, error);
        return [];
    } finally {
        // Ensure database connection is closed
        await db.$disconnect();
    }
}

// Retry mechanism for database operations
async function retryDatabaseOperation<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error as Error;

            // Exponential backoff
            const delay = baseDelay * Math.pow(2, attempt);
            console.warn(`Database operation failed. Retrying in ${delay}ms. Attempt ${attempt + 1}/${maxRetries}`);

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    console.error('Database operation failed after all retries:', lastError);
    throw new Error(`Operation failed after ${maxRetries} attempts. Last error: ${lastError?.message}`);
}
import {GithubRepoLoader} from '@langchain/community/document_loaders/web/github'
import { Document } from '@langchain/core/documents'
import { generateEmbedding, summarizeCode } from './gemini'
import { db } from '~/server/db'

export async function LoadGitRepo({gitUrl, gitToken}: {gitUrl: string, gitToken?: string}){
    const loader = new GithubRepoLoader(gitUrl, {
        accessToken: gitToken || process.env.GITHUB_TOKEN,
        ignoreFiles: [".gitignore", ".gitattributes", ".git/", "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "pnpm-workspace.yaml", "bun.lockb"],
        branch: "main",
        recursive: true,
        unknown: "warn",
        maxConcurrency: 5
    })

    const docs = await loader.load()
    return docs
}
const generateEmbeddings = async (docs: Document[]) => {
    return await Promise.all(docs.map(async (doc) => {
        const codeSummary =await summarizeCode(doc)
        const embedding = await generateEmbedding(codeSummary)
        return {
            codeSummary,
            embedding,
            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
            fileName: doc.metadata.source
        }
    }))
}
export async function indexGitRepo({gitUrl, gitToken, projectId}: {gitUrl: string, gitToken?: string, projectId: string}) {
    const docs = await LoadGitRepo({gitUrl, gitToken});
    const embeddings = await generateEmbeddings(docs);

    await Promise.allSettled(embeddings.map(async (embedding, index) => {
        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
            data: {
                projectId,
                summary: embedding.codeSummary,
                sourceCode: embedding.sourceCode,
                fileName: embedding.fileName
            }
        })

        await db.$executeRaw`
            UPDATE "SourceCodeEmbedding"
            SET "summaryEmbedding" = ${embedding.embedding}::vector
            WHERE id = ${sourceCodeEmbedding.id};
        `
    }))



}
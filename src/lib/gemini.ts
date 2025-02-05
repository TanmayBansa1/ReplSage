'use server'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Document } from "@langchain/core/documents";
import { streamText } from "ai"
import { createStreamableValue } from "ai/rsc"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { db } from "~/server/db";

// Create a simple rate limiter
class RateLimiter {
    private queue: Array<() => Promise<any>> = [];
    private isProcessing = false;
    private readonly RATE_LIMIT_MS = 2000; // 1 second between calls

    async enqueue<T>(task: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await task();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
            this.processQueue();
        });
    }

    private async processQueue() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        while (this.queue.length > 0) {
            const task = this.queue.shift();
            if (task) {
                await task();
                await new Promise(resolve => setTimeout(resolve, this.RATE_LIMIT_MS));
            }
        }

        this.isProcessing = false;
    }
}

const rateLimiter = new RateLimiter();

// Retry mechanism for API calls
async function retryOperation<T>(
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

            // Check if it's a rate limit error
            if (error instanceof Error && 'status' in error && (error as any).status === 429) {
                const delay = baseDelay * Math.pow(2, attempt);
                console.warn(`Rate limit hit. Retrying in ${delay}ms. Attempt ${attempt + 1}/${maxRetries}`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                // For non-rate limit errors, throw immediately
                throw error;
            }
        }
    }

    throw new Error(`Operation failed after ${maxRetries} attempts. Last error: ${lastError?.message}`);
}

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!
)
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b"
})

export async function generateSummary(diff: string) {
    return rateLimiter.enqueue(async () => {
        return retryOperation(async () => {
            const response = await model.generateContent([
                `You are an expert software developer, and you are trying to summarize a git diff.
                Reminders about the git diff format:
                For every file there are a few metadata lines (for example):
                \`\`\`
                diff --git a/lib/index.js b/lib/index.js
                index 9e7e2c8..6b6e2c8 100644
                --- a/lib/index.js
                +++ b/lib/index.js
                \`\`\`
                This means that \`lib/index.js\` was updated in this commit. Note that this is only a example.
                Then there is a specifier of the lines that were modified.
                A line starting with \`+\` is a line that was added.
                A line starting with \`-\` is a line that was removed.
                A line that starts with neither \`+\` nor \`-\` is code given for context, and better understanding.
                Please summarize the following diff in under 100 words: \n\n${diff}
                Keep it as short as possible with a max limit of 100 words.
                `
            ]);
            return response.response.text();
        }, 3, 1000);
    });
}

export async function summarizeCode(doc: Document) {
    const code = doc.pageContent.slice(0, 1000);
    return rateLimiter.enqueue(async () => {
        return retryOperation(async () => {
            const response = await model.generateContent([
                `You are an intelligent senior software developer, who specializes in code summarization.
                You are onboarding a new junior software developer, explaining to them the purpose of ${doc.metadata.source} file and you need to summarize the code they will be working with.
                Here is the code they will be working with: \n\n${code}
                \n\n
                Generate a short summary of no more than 100 words`
            ]);
            return response.response.text();
        }, 3, 1000);
    });
}

export const generateEmbedding = async (codeSummary: string) => {
    return rateLimiter.enqueue(async () => {
        return retryOperation(async () => {
            const embeddingModel = genAI.getGenerativeModel({
                model: "text-embedding-004"
            });
            const result = await embeddingModel.embedContent(codeSummary);
            return result.embedding.values;
        }, 3, 1000);
    });
}

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY!
})

export async function askQuestion(question: string, projectId: string) {

    const stream = createStreamableValue();
    const questionEmbedding = await generateEmbedding(question)

    const vectorQuery = `[${questionEmbedding.join(",")}]`

    const result = await db.$queryRaw`
            SELECT "sourceCode", "fileName", "summary",
            1-("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
            FROM "SourceCodeEmbedding"
            WHERE 1-("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
            AND "projectId" = ${projectId}
            ORDER BY "similarity" DESC
            LIMIT 10
            ` as { fileName: string, summary: string, sourceCode: string }[]

    let context = "";

    for (const { fileName, summary, sourceCode } of result) {
        context += `File Name: ${fileName}\nSummary: ${summary}\nCode:\n${sourceCode}\n\n`;
    }

    const { textStream } = await streamText({
        model: google("gemini-1.5-flash"),
        prompt: `You are an ai code assistant, who answers questions about the codebase. 
        Your target audience is a technical intern.
        An AI assistant is a brand new, powerful tool, human-like artificial intelligence.
        The traits of an AI inlude expert language knowledge, helpfulness, cleverness, and articulateness.
        AI is a well-behaved and well-mannered individual.
        AI is always friendly and helpful, kind and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
        AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic is the codebase.
        If the question is asking about code or a specific file, AI will provide the detailed answer, giving step by step instructions on how to achieve the result.
        START CONTEXT BLOCK:
        ${context}
        END CONTEXT BLOCK
        
        START QUESTION:
        ${question}
        END QUESTION
        
        AI assistant will take into account any CONTEXT BLOCK that is providwed, in a conversation.
        If the context does not provide the answer to question, the AI assistant will say. "I'm sorry, but I don't know the answer to that question."
        AI assistant will not apologise for previous responses, but instead will indicate new information was gained.
        AI will not invent anything that is not directly drawn from the context.
        Answer in markdown syntax. With code snippets if needed. Be as detailed as possible when answering, make sure there is nothing missed.  
        `
    });

    // Stream the response
    (async () => {
        for await (const chunk of textStream) {
            stream.update(chunk)
        }
        stream.done();
    })()
    return {
        output: stream.value,
        fileReferences: result,
        // Allow caller to await stream completion if needed
    };
    ;
};

import {GoogleGenerativeAI} from "@google/generative-ai"
import { Document } from "@langchain/core/documents";

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!   
)
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
})

export async function generateSummary(diff: string) {

    try{

        
        const response = await model.generateContent([
            `You are an expert software developer, and you are tryin to summarize a git diff.
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
            A line that starts with neither \`+\` nor \`-\` is code given for context, and better understanging.
            It is not a part of the diff.
            [...]
            EXAMPLE SUMMARY COMMENTS:
            \`\`\`
            * Raised the amount of reorderings from \`10\` to \`100\` [packages/server/reorderings_api.ts], [packages/server/constants.ts].
            * Fixed a typo in the githubs action name [packages/server/github.ts], [packages/server/constants.ts].
            * Added an OpenAI API for completions [packages/utils/apis/openai.ts].
            * Moved the \`lost\` files detection to the \`github\` package [api/lib/github.ts], [packages/lost/index.ts].
            * Lowered numeric tolerance for lost files
            \`\`\`
            Most commits will have less commments than this example list.
            The last comment does not include the file names,
            because there were more than two relevant files in this hypothetical commit.
            Do not include parts of this example in your summary.It is only given as an example of appropriate formatting.
            Please summarize the following diff: \n\n${diff}
            `
        ]);
        return response.response.text();  
    }catch(e){
        console.log("generating summary of the commit went into a error", e)
        return ""
    }
}

export async function summarizeCode( doc: Document){

    const code = doc.pageContent.slice(0, 1000);
    try{

        const response  = await model.generateContent([
            `You are an intelligent senior software developer, who specializes in code summarization.
            You are onboarding a new junior software developer, explaining to them the purpose of ${doc.metadata.source} file and you need to summarize the code they will be working with.
            Here is the code they will be working with: \n\n${code}
            \n\n
            Generate a short summary of no more than 100 words`
        ])
        
        return response.response.text();
    }catch(e){
        console.log("summarizing code error", e)
        return ""
    }
}

export const generateEmbedding = async (codeSummary: string) => {
    const model = genAI.getGenerativeModel({
        model: "text-embedding-004"
    })
    try{

        const result = await model.embedContent(codeSummary)
        return result.embedding.values;
    }catch(e){
        console.log("embedding error", e)
        return new Array(768).fill(0)
    }
}
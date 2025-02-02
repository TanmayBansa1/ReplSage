import {GoogleGenerativeAI} from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!   
)
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
})

export async function generateSummary(diff: string) {

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
}
import {GithubRepoLoader} from '@langchain/community/document_loaders/web/github'

export async function LoadGitRepo({gitUrl, gitToken}: {gitUrl: string, gitToken?: string}){
    const loader = new GithubRepoLoader(gitUrl, {
        accessToken: gitToken || "",
        ignoreFiles: [".gitignore", ".gitattributes", ".git/", "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "pnpm-workspace.yaml", "bun.lockb"],
        branch: "main",
        recursive: true,
        unknown: "warn",
        maxConcurrency: 5
    })

    const docs = await loader.load()
    return docs
}
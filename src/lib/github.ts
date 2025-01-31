import { Octokit } from "octokit"

export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
})

const gitURL = 'https://github.com/docker/genai-stack'

type Response ={
    commitMessage: String
    commitHash: String
    commitAuthor: String
    commitAuthorAvatar: String
    commitDate: String
}

export const getCommits = async (gitUrl: string): Promise<Response[]> => {
    const [owner, repo] = gitUrl.replace('https://github.com/', '').split('/');

    const response = await octokit.rest.repos.listCommits({
        owner: owner as string,
        repo: repo as string,
        per_page: 5  // Limit to 10 most recent commits
    });

    return response.data.map(commit => ({
        commitMessage: commit.commit.message,
        commitHash: commit.sha,
        commitAuthor: commit.commit.author?.name || 'Unknown',
        commitAuthorAvatar: commit.author?.avatar_url || '',
        commitDate: commit.commit.author?.date || ''
    }));
}
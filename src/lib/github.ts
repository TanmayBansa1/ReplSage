import { Octokit } from "octokit"
import { db } from "~/server/db"
import { generateSummary } from "./gemini"
import axios from 'axios';
export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
})

type Response ={
    commitMessage: string
    commitHash: string
    commitAuthor: string
    commitAuthorAvatar: string
    commitDate: string
}

export const getCommitHashes = async (gitUrl: string): Promise<Response[]> => {
    const [owner, repo] = gitUrl.replace('https://github.com/', '').split('/');
    if(!owner || !repo) {
        throw new Error('Invalid GitHub URL');
    }

    const response = await octokit.rest.repos.listCommits({
        owner: owner as string,
        repo: repo as string,
        per_page: 5  // Limit to 10 most recent commits
    });
    const sortedCommits = response.data.sort((a:any, b:any) => new Date(b.commit.author?.date).getTime() - new Date(a.commit.author?.date).getTime()) as any[];
    return sortedCommits.slice(0, 5).map(commit => ({
        commitMessage: commit.commit.message,
        commitHash: commit.sha as string,
        commitAuthor: commit.commit.author?.name || 'Unknown',
        commitAuthorAvatar: commit.author?.avatar_url || '',
        commitDate: commit.commit.author?.date || ''
    }));
}
async function fetchProjectURL(projectId: string): Promise<{project: any, gitURL: string}>{
    const project = await db.project.findUnique({
        where: {
            id: projectId
        },
        select: {
            url: true,
        }
    })
    if(!project?.url){
        throw new Error('Project URL not found')
    }
    return {project, gitURL: project.url}
}
async function summarizeCommit(gitURL: string, commitHash: string){

    const {data} = await axios.get(`${gitURL}/commit/${commitHash}.diff`, { 
        headers: {
            'Accept': 'application/vnd.github.v3.diff',
        }
    });
    return await generateSummary(data) || "no summary generated for this commit";
}
export async function pollCommits(projectId: string){

    const {project, gitURL} = await fetchProjectURL(projectId);
    const commitsRecieved = await getCommitHashes(gitURL)

    const processedCommits = await db.commit.findMany({
        where: {
            projectId: projectId,
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 5
    })

    const unprocessedCommits = commitsRecieved.filter(commit => !processedCommits.some(processedCommit => processedCommit.commitHash === commit.commitHash));
    

    const summaryResponses = await Promise.allSettled(unprocessedCommits.map(commit => summarizeCommit(gitURL, commit.commitHash as string)))

    const summaries = summaryResponses.map((response) => {
        if(response.status === 'fulfilled'){
            return response.value as string
        }
        return ""
        
    })

    const commits = await db.commit.createMany({
        data: summaries.map((summary, index) => {
            console.log("processing commit", index);

            return {
                projectId: projectId,
                commitHash: unprocessedCommits[index]!.commitHash,
                commitMessage: unprocessedCommits[index]!.commitMessage,
                commitAuthor: unprocessedCommits[index]!.commitAuthor,
                commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
                summary: summary as string,
                commitDate: unprocessedCommits[index]!.commitDate,
            }
        })
    })
    return commits;
}

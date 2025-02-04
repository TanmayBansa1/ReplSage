import { pollCommits } from "~/lib/github";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { indexGitRepo } from "~/lib/github-loader";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(
        z.object({
            name: z.string(),
            url: z.string(),
            githubToken: z.string().optional(),
        })
    ).mutation(async ({ ctx, input }) => {

        const project = await ctx.db.project.create({
            data: {
                name: input.name,
                url: input.url,
                githubToken: input.githubToken,
                userToProject: {
                    create: {
                        userId: ctx.user.userId!,
                        
                    }
                }
            },
        });
        await indexGitRepo({gitUrl: input.url, gitToken: input.githubToken, projectId: project.id})
        await pollCommits(project.id);
        return project;
    }),
    getProjects: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.project.findMany({
            where: {
                userToProject: {
                    some: {
                        userId: ctx.user.userId!
                    }
                },
                deletedAt: null
            }
        })
    }),
    getCommits: protectedProcedure.input(
        z.object({
            projectId: z.string(),
        })
    ).query(async ({ ctx, input }) => {
        pollCommits(input.projectId).then().catch((err) => {
            console.log(err)
        })
        return await ctx.db.commit.findMany({
            where: {
                projectId: input.projectId,
            }
        })  
    })
})
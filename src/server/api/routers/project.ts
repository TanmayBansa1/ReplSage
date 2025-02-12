import { pollCommits } from "~/lib/github";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { indexGitRepo } from "~/lib/github-loader";
import { transcribeMeeting } from "~/lib/assemblyai";

const MAX_DURATION = 300;

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(
        z.object({
            name: z.string().min(2, "Project name must be at least 2 characters"),
            url: z.string().url("Invalid repository URL").refine(
                (url) => /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+(\/?)?$/.test(url),
                { message: "Must be a valid GitHub repository URL" }
            ),
            githubToken: z.string().optional(),
        })
    ).mutation(async ({ ctx, input }) => {
        try {
            // Check if project with same URL already exists for this user
            const existingProject = await ctx.db.project.findFirst({
                where: {
                    url: input.url,
                    userToProject: {
                        some: {
                            userId: ctx.user.userId!
                        }
                    }
                }
            });

            if (existingProject) {
                throw new Error("You have already added this repository");
            }

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
            
            // Perform async operations without blocking the response
            Promise.all([
                indexGitRepo({gitUrl: input.url, gitToken: input.githubToken, projectId: project.id}),
                pollCommits(project.id)
            ]).catch(err => {
                console.error('Background project setup error:', err);
            });

            return project;
        } catch (error) {
            console.error('Project creation error:', error);
            throw new Error(
                error instanceof Error 
                    ? error.message 
                    : 'Failed to create project. Please check your inputs and try again.'
            );
        }
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
    }),
    saveAnswer: protectedProcedure.input(
        z.object({
            projectId: z.string(),
            question: z.string(),
            answer: z.string(),
            fileReferences: z.any().optional()
        })
    ).mutation(async ({ ctx, input }) => {
        return await ctx.db.question.create({
            data: {
                projectId: input.projectId,
                question: input.question,
                answer: input.answer,
                fileReferences: input.fileReferences,
                userId: ctx.user.userId!
            }
        })
    }),
    getQuestions: protectedProcedure.input(
        z.object({
            projectId: z.string(),
        })
    ).query(async ({ ctx, input }) => {
        return await ctx.db.question.findMany({
            where: {
                projectId: input.projectId,
            },
            include: {
                user: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }),
    uploadMeeting: protectedProcedure.input(
        z.object({
            projectId: z.string(),
            meetingUrl: z.string(),
            name: z.string()
        })
    ).mutation(async ({ ctx, input }) => {
        return await ctx.db.meeting.create({
            data: {
                projectId: input.projectId,
                meetingUrl: input.meetingUrl,
                name: input.name
            }
        })
    }),
    getMeetings: protectedProcedure.input(
        z.object({
            projectId: z.string(),
        })
    ).query(async ({ ctx, input }) => {
        return await ctx.db.meeting.findMany({
            where: {
                projectId: input.projectId,
            },
            include: {
                issues: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }),
    deleteMeeting: protectedProcedure.input(
        z.object({
            meetingId: z.string(),
        })
    ).mutation(async ({ ctx, input }) => {
         await ctx.db.meeting.delete({
            where: {
                id: input.meetingId,
            }
        })
        
    })
})
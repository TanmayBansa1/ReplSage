"use client"
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import useProject from '~/hooks/use-project'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'

const CommitLog = () => {

    const { selectedProjectID, project } = useProject();

    const { data: commits } = api.project.getCommits.useQuery({ projectId: selectedProjectID });

    return (
        <div>
            <ul className='space-y-6'>
                {commits?.map((commit, index) => (
                    <li key={commit.id} className='relative flex gap-x-4'>
                        <div className={cn(
                            index === commits.length - 1 ? 'h-6' : '-bottom-6',
                            'absolute left-0 top-0 flex w-6 justify-center'
                        )}>
                            <div className=' w-px dark:bg-gray-800 bg-gray-200 translate-x-1'>

                            </div>
                        </div>
                        <>
                            <Image src={commit.commitAuthorAvatar} alt={commit.commitAuthor} width={24} height={24} className='size-8 rounded-full flex-none relative mt-4 mb-4 bg-gray-50 '></Image>
                            <div className='flex-auto rounded-lg  dark:bg-gray-900 bg-white p-3 ring-1 ring-inset dark:ring-gray-500 ring-gray-200'>
                                <div className='flex justify-between gap-x-4'>
                                    <Link href={`${project?.url}/commits/${commit.commitHash}`} className='py-0.5 text-xs leading-5 font-medium text-gray-900'>
                                        <span className='font-semibold text-lg dark:text-white text-gray-800'>
                                            {commit.commitAuthor}

                                        </span>
                                        <span className='inline-flex items-center dark:text-gray-400 text-lg text-gray-500 ml-1'>committed

                                            <ExternalLink className='size-4 ml-2 flex-shrink-0 '></ExternalLink>

                                        </span>
                                    </Link>

                                </div>
                                    <span className='font-semibold'>{commit.commitMessage}</span>
                                    <pre className='mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600 dark:text-gray-400'>{commit.summary}</pre >

                            </div>


                        </>

                    </li>
                ))}
            </ul>
        </div>
    )
}

export default CommitLog
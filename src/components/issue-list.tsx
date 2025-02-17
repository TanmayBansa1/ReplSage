'use client'

import { VideoIcon } from 'lucide-react'
import React from 'react'
import { api } from '~/trpc/react'
import IssueCard from './issue-card'

type Props = {
    meetingId: string
}

const IssueList = ({meetingId}: Props) => {
  
  const {data: meeting, isLoading} = api.project.getMeetingbyId.useQuery({meetingId})
  if(isLoading || !meeting){
    return <div>Loading...</div>
  }

    return (
    <div className='p-8'>
      <div className='mx-auto flex max-w-2xl items-center justify-between gap-x-4 border-b pb-6 lg:mx-0 lg:max-w-none'>
        <div className='flex items-center gap-x-6'>
          <div className='rounded-full border bg-white p-3'>
            <VideoIcon className='size-5 dark:text-gray-950 '></VideoIcon>

          </div>
          <h1>
            <div className='text-sm leading-6 text-gray-600'>
              Meeting on {""}{meeting.createdAt.toLocaleString()}

            </div>
            <div className='mt-1 text-base font-semibold leading-6 text-gray-950 dark:text-white'>
              {meeting.name}

            </div>
          </h1>

        </div>
        

      </div>
      <div className='mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3'>
        {meeting.issues.map((issue, index) => (
          <IssueCard key={index} issue={issue} />
        ))}
      </div>
    </div>
  )
}

export default IssueList
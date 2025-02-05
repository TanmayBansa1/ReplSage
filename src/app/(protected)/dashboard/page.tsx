'use client'
import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import QuestionCard from '~/components/ask-question-card';
import CommitLog from '~/components/commit-log';
import useProject from '~/hooks/use-project';



const Dashboard = () => {
    const {project} = useProject()
  return (
    <div>
      <div className='flex items-center justify-between gap-y-4 flex-wrap'>
        {/* github link */}
        <div className='max-w-xl w-fit rounded-lg bg-primary px-4 py-3 flex items-center justify-center gap-3'>
          <Github className='size-6 text-white mt-1 flex-shrink-0'></Github>
          <div className='flex-grow justify-center items-center'>
            <Link 
              href={project?.url || "/dashboard"} 
              className='text-sm text-white flex items-center gap-2 break-all hover:underline'
            >
              {project?.url}
              <ExternalLink className='size-4 ml-2 flex-shrink-0'></ExternalLink>
            </Link>
          </div>
        </div>
          <div className='h-4'></div>

          <div className='flex items-center gap-4'>
            Team Members
            Archive Button
            Invitation Button

          </div>


      </div>

      <div className='mt-4'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 '>
          <QuestionCard></QuestionCard> CreditCardIcon
          Meeting Card

        </div>
      </div>

      <div className="mt-8">
        <CommitLog></CommitLog>
      </div>
    </div>
  )
}

export default Dashboard
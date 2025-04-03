'use client'

import { VideoIcon, FileTextIcon } from 'lucide-react'
import React from 'react'
import { api } from '~/trpc/react'
import IssueCard from './issue-card'
import { motion } from 'framer-motion'
import { Badge } from './ui/badge'
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card'

type Props = {
    meetingId: string
}

const IssueList = ({meetingId}: Props) => {
  
  const {data: meeting, isLoading} = api.project.getMeetingbyId.useQuery({meetingId})
  if(isLoading || !meeting){
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='flex justify-center items-center h-full p-8'
      >
        <div className='text-center'>
          <div className='animate-pulse'>
            <FileTextIcon className='mx-auto size-12 text-gray-400' />
          </div>
          <p className='mt-4 text-gray-600'>Loading issues...</p>
        </div>
      </motion.div>
    )
  }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.1
            }
        }
    }

    return (
    <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className='p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen'
    >
      <Card className='mb-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-none shadow-lg'>
        <CardHeader className='flex flex-row items-center space-x-4'>
          <div className='rounded-full bg-blue-100 dark:bg-blue-900/30 p-3'>
            <VideoIcon className='size-6 text-blue-600 dark:text-blue-400' />
          </div>
          <div>
            <CardTitle className='text-xl font-bold text-gray-900 dark:text-white'>
              {meeting.name}
            </CardTitle>
            <CardDescription className='text-gray-600 dark:text-gray-300'>
              Meeting on {meeting.createdAt.toLocaleString()}
            </CardDescription>
          </div>
          <Badge variant='secondary' className='ml-auto'>
            {meeting.issues.length} Issues
          </Badge>
        </CardHeader>
      </Card>
      
      <motion.div 
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        variants={containerVariants}
      >
        {meeting.issues.map((issue, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className='group'
          >
            <IssueCard issue={issue} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default IssueList
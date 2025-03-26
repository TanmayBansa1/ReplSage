"use client"
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { motion, useInView } from 'framer-motion'
import useProject from '~/hooks/use-project'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'

const CommitLogItem = ({ commit, index, totalCommits }: { 
  commit: any, 
  index: number, 
  totalCommits: number 
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.li 
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: isInView ? 1 : 0, 
        y: isInView ? 0 : 50 
      }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1 
      }}
      key={commit.id} 
      className='relative flex items-start gap-x-4 pl-4'
    >
      <div className={cn(
        index === totalCommits - 1 ? 'h-6' : '-bottom-6',
        'absolute left-0 top-0 flex w-6 justify-center'
      )}>
        <div className='w-px h-full dark:bg-gray-800 bg-gray-200 absolute left-1/2 transform -translate-x-1/2'></div>
      </div>
      <div className='absolute left-0 top-4 w-6 flex justify-center'>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: isInView ? 1 : 0.8, 
            opacity: isInView ? 1 : 0 
          }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className='z-10'
        >
          <Image 
            src={commit.commitAuthorAvatar} 
            alt={commit.commitAuthor} 
            width={48} 
            height={48} 
            className='rounded-full w-8 h-8 hover:animate-pulse hover:scale-105'
          />
        </motion.div>
      </div>
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ 
          opacity: isInView ? 1 : 0, 
          x: isInView ? 0 : -50 
        }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className='flex-auto ml-10 rounded-lg dark:bg-gray-900 bg-white p-3 ring-1 ring-inset dark:ring-gray-500 ring-gray-200'
      >
        <div className='flex justify-between gap-x-4'>
          <Link href={`${commit.project?.url}/commits/${commit.commitHash}`} className='py-0.5 text-xs leading-5 font-medium text-gray-900'>
            <span className='font-semibold text-lg dark:text-white text-gray-800'>
              {commit.commitAuthor}
            </span>
            <span className='inline-flex items-center dark:text-gray-400 text-lg text-gray-500 ml-1'>
              committed
              <ExternalLink className='size-4 ml-2 flex-shrink-0' />
            </span>
          </Link>
        </div>
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: (index * 0.1) + 0.2 }}
          className='font-semibold block mt-2'
        >
          {commit.commitMessage}
        </motion.span>
        <motion.pre 
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isInView ? 1 : 0, 
            y: isInView ? 0 : 20 
          }}
          transition={{ duration: 0.5, delay: (index * 0.1) + 0.3 }}
          className='mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600 dark:text-gray-400'
        >
          {commit.summary}
        </motion.pre>
      </motion.div>
    </motion.li>
  );
};

const CommitLog = () => {
  const { selectedProjectID} = useProject();

  const { data: commits } = api.project.getCommits.useQuery({ projectId: selectedProjectID });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ul className='space-y-6'>
        {commits?.map((commit, index) => (
          <CommitLogItem 
            key={commit.id} 
            commit={commit} 
            index={index} 
            totalCommits={commits.length} 
          />
        ))}
      </ul>
    </motion.div>
  )
}

export default CommitLog
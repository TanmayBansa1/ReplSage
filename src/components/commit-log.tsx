'use client';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  GitCommit, 
  Clock 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import useProject from '~/hooks/use-project';
import { api } from '~/trpc/react';

const CommitLogItem = ({ 
  commit, 
  index, 
  totalCommits 
}: { 
  commit: {
    summary: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    projectId: string;
    commitMessage: string;
    commitHash: string;
    commitAuthor: string;
    commitAuthorAvatar: string;
    commitDate: Date;
  }, 
  index: number, 
  totalCommits: number 
}) => {
  const ref = useRef(null);
  
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
  
    const units: Array<[number, Intl.RelativeTimeFormatUnit]> = [
      [60 * 60 * 24 * 365, 'year'],
      [60 * 60 * 24 * 30, 'month'],
      [60 * 60 * 24 * 7, 'week'],
      [60 * 60 * 24, 'day'],
      [60 * 60, 'hour'],
      [60, 'minute'],
      [1, 'second']
    ];
  
    for (const [seconds, unit] of units) {
      const value = Math.floor(Math.abs(diffInSeconds) / seconds);
      if (value >= 1) {
        return new Intl.RelativeTimeFormat('en', { 
          numeric: 'auto',
          style: 'long'
        }).format(-value, unit);
      }
    }
  
    return 'Just now';
  };

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.5,
          delay: index * 0.1
        }
      }}
      viewport={{ once: true, amount: 0.2 }}
      className="relative flex items-center"
    >
      {/* Vertical Git Graph Line */}
      <div 
        className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"
        style={{
          height: '100%',
          transform: index === 0 ? 'translateY(50%)' : 
                    index === totalCommits - 1 ? 'translateY(-50%)' : ''
        }}
      />
      
      {/* Commit Dot */}
      <div 
        className="absolute left-8 z-10 w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700"
        style={{ 
          transform: 'translateX(-50%)',
          border: '2px solid white',
          boxShadow: '0 0 0 2px #e5e7eb' 
        }}
      />

      <div className="pl-16 w-full">
        <Card className="hover:shadow-lg transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <Avatar>
              <AvatarImage 
                src={commit.commitAuthorAvatar} 
                alt={commit.commitAuthor} 
              />
              <AvatarFallback>
                {commit.commitAuthor?.charAt(0) || 'C'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {commit.commitMessage || 'Unnamed Commit'}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                {commit.commitAuthor || 'Unknown Author'}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center space-x-1">
                      <GitCommit className="h-4 w-4" />
                      <span>{commit.commitHash?.slice(0, 7) || 'N/A'}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Full Commit Hash: {commit.commitHash || 'Unknown'}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTimestamp(commit.commitDate)}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {commit.commitDate.toLocaleString()}
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            {commit.summary && (
              <div className="text-sm text-muted-foreground mb-2">
                {commit.summary}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

const CommitLog = () => {
  const { selectedProjectID } = useProject();

  const { data: commits, isLoading } = api.project.getCommits.useQuery(
    { projectId: selectedProjectID }, 
    { enabled: !!selectedProjectID }
  );

  if (isLoading) return <div>Loading commits...</div>;
  if (!commits || commits.length === 0) return <div>No commits found</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative pl-8"
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
  );
};

export default CommitLog;
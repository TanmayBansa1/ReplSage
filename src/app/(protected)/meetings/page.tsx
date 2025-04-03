'use client'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'
import MeetingCard from '~/components/meeting-card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import useProject from '~/hooks/use-project'
import { api } from '~/trpc/react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Trash2, Eye, Clock, AlertTriangle } from 'lucide-react'

const Meetings = () => {
    const { selectedProjectID } = useProject()
    const { data: meetings, isLoading } = api.project.getMeetings.useQuery({ projectId: selectedProjectID }, {
        refetchInterval: 10000
    })
    const deleteMeeting = api.project.deleteMeeting.useMutation();
    const utils = api.useUtils();

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

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        }
    }

    const getPriorityColor = (issueCount: number) => {
        switch (true) {
            case issueCount > 5:
                return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            case issueCount > 2:
                return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
            default:
                return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
        }
    }

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className='p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen'
        >
            <MeetingCard />
            <div className='h-6'></div>

            {isLoading ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='flex justify-center items-center h-full'
                >
                    <div className='text-center'>
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 10, -10, 0]
                            }}
                            transition={{ 
                                duration: 1,
                                repeat: Infinity,
                                repeatType: "loop"
                            }}
                        >
                            <FileText className='mx-auto size-12 text-gray-400' />
                        </motion.div>
                        <p className='mt-4 text-gray-600 text-xl font-bold'>
                            Loading Meetings
                        </p>
                    </div>
                </motion.div>
            ) : meetings?.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-center py-12'
                >
                    <AlertTriangle className='mx-auto size-12 text-gray-400 mb-4' />
                    <p className='text-gray-800 dark:text-gray-200 text-xl font-bold'>
                        No meetings yet
                    </p>
                </motion.div>
            ) : (
                <motion.div variants={containerVariants}>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center'>
                        <Clock className='mr-3 size-6 text-blue-600 dark:text-blue-400' />
                        Meetings
                    </h2>
                    <AnimatePresence>
                        <motion.ul 
                            className='space-y-4'
                            variants={containerVariants}
                        >
                            {meetings?.map((meeting) => (
                                <motion.li 
                                    key={meeting.id}
                                    variants={itemVariants}
                                    whileHover={{ 
                                        scale: 1.02, 
                                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)" 
                                    }}
                                    className='bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden'
                                >
                                    <div className='p-6 flex items-center justify-between'>
                                        <div className='flex-grow'>
                                            <div className='flex items-center gap-4'>
                                                <Link 
                                                    href={`/meetings/${meeting.id}`} 
                                                    className='text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 transition-colors'
                                                >
                                                    {meeting.name}
                                                </Link>
                                                {meeting.status === 'PROCESSING' && (
                                                    <Badge className='bg-yellow-500 text-white'>
                                                        Processing
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className='flex items-center text-gray-500 dark:text-gray-400 text-sm mt-2 space-x-4'>
                                                <div className='flex items-center gap-2'>
                                                    <Clock className='size-4' />
                                                    <p>{meeting.createdAt.toLocaleDateString()}</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <FileText className='size-4' />
                                                    <Badge 
                                                        className={`${getPriorityColor(meeting.issues.length)} rounded-full px-2 py-1 text-xs`}
                                                    >
                                                        {meeting.issues.length} Issues
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex items-center space-x-4'>
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Link href={`/meetings/${meeting.id}`}>
                                                    <Button 
                                                        variant={'outline'} 
                                                        className='flex items-center gap-2'
                                                    >
                                                        <Eye className='size-4' />
                                                        View Meeting
                                                    </Button>
                                                </Link>
                                            </motion.div>
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Button 
                                                    variant={'destructive'} 
                                                    disabled={deleteMeeting.isPending}
                                                    onClick={() => deleteMeeting.mutate({ meetingId: meeting.id }, {
                                                        onSuccess: () => {
                                                            toast.success("Meeting deleted")
                                                            utils.project.getMeetings.invalidate()
                                                        },
                                                        onError: (err) => {
                                                            toast.error("Error while deleting meeting")
                                                            console.log(err, "error while deleting meeting")
                                                        }
                                                    })}
                                                    className='flex items-center gap-2'
                                                >
                                                    <Trash2 className='size-4' />
                                                    {deleteMeeting.isPending ? 'Deleting...' : 'Delete'}
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </AnimatePresence>
                </motion.div>
            )}
        </motion.div>
    )
}

export default Meetings
import React from 'react'
import type { RouterOutputs } from '~/trpc/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTitle } from './ui/dialog'
import { motion } from 'framer-motion'
import { Clock, AlertTriangle, FileText } from 'lucide-react'
import { Badge } from './ui/badge'

type Props = {
    issue: NonNullable<RouterOutputs["project"]["getMeetingbyId"]>["issues"][number]
}

const IssueCard = ({ issue }: Props) => {
    const [open, setOpen] = React.useState(false)

    const getPriorityColor = () => {
        switch (true) {
            case issue.summary.toLowerCase().includes('critical'):
                return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            case issue.summary.toLowerCase().includes('important'):
                return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
            default:
                return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='max-w-lg'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl font-bold text-gray-900 dark:text-white'>
                            {issue.gist}
                        </DialogTitle>
                        <DialogDescription className='text-gray-600 dark:text-gray-300 flex items-center space-x-2'>
                            <Clock className='size-4' />
                            <span>{issue.createdAt.toLocaleString()}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4'>
                        <div className='flex items-center space-x-2'>
                            <FileText className='size-5 text-gray-500' />
                            <p className='text-gray-700 dark:text-gray-300'>{issue.headline}</p>
                        </div>
                        <blockquote className='border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg'>
                            <div className='flex items-center space-x-2 mb-2'>
                                <AlertTriangle className='size-5 text-blue-600 dark:text-blue-400' />
                                <span className='text-sm text-gray-600 dark:text-gray-300'>
                                    {issue.start} - {issue.end}
                                </span>
                            </div>
                            <p className='italic text-gray-700 dark:text-gray-300'>
                                {issue.summary}
                            </p>
                        </blockquote>
                    </div>
                </DialogContent>
            </Dialog>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                    transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                className='h-full'
            >
                <Card className='relative overflow-hidden h-full flex flex-col'>
                    <CardHeader className='pb-2'>
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            <div className='flex justify-between items-start'>
                                <CardTitle className='text-xl font-bold text-gray-900 dark:text-white'>
                                    {issue.gist}
                                </CardTitle>
                                <Badge 
                                    className={`${getPriorityColor()} rounded-full px-2 py-1 text-xs`}
                                >
                                    {issue.summary.toLowerCase().includes('critical') 
                                        ? 'Critical' 
                                        : issue.summary.toLowerCase().includes('important') 
                                            ? 'Important' 
                                            : 'Normal'}
                                </Badge>
                            </div>
                            <Separator className='mt-2 mb-3 bg-gray-200 dark:bg-gray-700'></Separator>
                            <CardDescription className='text-gray-600 dark:text-gray-300'>
                                {issue.headline}
                            </CardDescription>
                        </motion.div>
                    </CardHeader>
                    <CardContent className='flex-grow flex flex-col justify-end'>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='mt-auto'
                        >
                            <Button 
                                onClick={() => setOpen(true)} 
                                variant={'default'} 
                                className='w-full mt-4bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg'
                            >
                                View Details
                            </Button>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </>
    )
}

export default IssueCard
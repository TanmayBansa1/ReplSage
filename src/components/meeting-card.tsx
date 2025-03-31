'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { uploadFile } from '~/lib/firebase'
import { Card } from './ui/card'
import { Presentation, Upload } from 'lucide-react'
import { Button } from './ui/button'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { api } from '~/trpc/react'
import useProject from '~/hooks/use-project'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'

const MeetingCard = () => {
    const router = useRouter()
    const { project } = useProject()
    const [isUploading, setIsUploading] = React.useState(false)
    const [progress, setProgress] = React.useState(0)
    const uploadMeeting = api.project.uploadMeeting.useMutation();
    const processMeeting = useMutation( {mutationFn: async (data : {meetingUrl: string, meetingId: string}) => {
        console.log(data)
        const response = await axios.post('/api/process-meeting', {
            meetingUrl: data.meetingUrl,
            meetingId: data.meetingId
        })
        return response.data;
    }})
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            "audio/*": [".mp3", ".wav", ".m4a"]
        },
        multiple: false,
        maxSize: 50_000_000,
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0];
            if(!file){
                throw new Error("no file selected, unexpected error")
            }
            
            setIsUploading(true);
            
            try {
                const meetingUrl = await uploadFile(file, setProgress) as string;
                
                const uploadResult = await uploadMeeting.mutateAsync({
                    projectId: project!.id,
                    meetingUrl: meetingUrl,
                    name: file.name
                });

                // Ensure meetingId is available before processing
                setIsUploading(false);
                setProgress(0);
                toast.success("Meeting uploaded");
                router.push('/meetings');
                if (uploadResult.id) {
                    await processMeeting.mutateAsync({
                        meetingUrl: meetingUrl,
                        meetingId: uploadResult.id
                    });
                } else {
                    throw new Error('No meeting ID received');
                }

            } catch (error) {
                console.error('Upload or processing error:', error);
                toast.error("Error uploading or processing meeting");
                setIsUploading(false);
            }
        }
    });

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <Card 
                className={`
                    relative col-span-3 
                    transition-all duration-300 
                    bg-gradient-to-br from-white/90 to-indigo-50/50 dark:from-gray-900/90 dark:to-indigo-950/50 
                    border-2 border-indigo-100/50 dark:border-indigo-900/30 
                    rounded-xl 
                    hover:shadow-2xl hover:scale-[1.01]
                    overflow-hidden
                    p-3
                `} 
                {...getRootProps()}
            >
                {!isUploading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center p-6 space-y-4 text-center"
                    >
                        <motion.div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-full shadow-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Presentation className='h-8 w-8'></Presentation>
                        </motion.div>
                        
                        <div className="space-y-2">
                            <h3 className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400'>
                                Create a New Meeting
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto'>
                                Leverage AI to analyze your meeting insights. Upload an audio file and let Sage transform your conversations into actionable intelligence.
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button 
                                disabled={isUploading}
                                className="
                                    transition-all duration-300 
                                    hover:scale-105 active:scale-95
                                    bg-gradient-to-r from-indigo-500 to-purple-600 
                                    text-white 
                                    hover:from-indigo-600 hover:to-purple-700 
                                    shadow-md hover:shadow-lg
                                "
                            >
                                <Upload className='-ml-0.5 mr-1.5 h-5 w-5'></Upload>
                                Upload Meeting 
                                <input className='hidden' {...getInputProps()}></input>
                            </Button>
                        </div>

                        <p className='text-xs text-muted-foreground'>
                            Sample meeting here -- <a 
                                target='_blank' 
                                href="https://assembly.ai/sports_injuries.mp3" 
                                className='underline hover:text-primary transition-colors'
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering file upload
                                }}
                                rel="noopener noreferrer"
                            >
                                https://assembly.ai/sports_injuries.mp3
                            </a>
                        </p>
                    </motion.div>
                )}
                {isUploading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center p-6 space-y-4"
                    >
                        <CircularProgressbar 
                            value={progress} 
                            text={`${progress}%`} 
                            className='size-24 animate-pulse' 
                            styles={buildStyles({
                                pathColor: `rgb(99, 102, 241)`, // indigo-500
                                trailColor: `rgb(165, 180, 252)`, // indigo-300
                                textColor: `rgb(79, 70, 229)`, // indigo-600
                                backgroundColor: `rgba(99, 102, 241, 0.1)` // indigo-500 with opacity
                            })}
                        />
                        <motion.p 
                            className="text-lg font-medium text-indigo-600 dark:text-indigo-400 animate-pulse"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                        >
                            Uploading your meeting: {progress}%
                        </motion.p>
                    </motion.div>
                )}
            </Card>
        </motion.div>
    )
}

export default MeetingCard
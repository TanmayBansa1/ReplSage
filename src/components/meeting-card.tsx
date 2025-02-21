'use client'
import React from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadFile } from '~/lib/firebase'
import { Card } from './ui/card'
import { Presentation, Upload } from 'lucide-react'
import { Button } from './ui/button'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { api } from '~/trpc/react'
import  useProject  from '~/hooks/use-project'
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
        
    })

  return (
    <div>
        <Card className="col-span-2 flex flex-col items-center justify-center p-5" {...getRootProps()}>
            {!isUploading && (
                <>
                    <Presentation className='h-10 w-10 animate-bounce'></Presentation>
                    <h3 className='mt-2 text-sm font-semibold text-gray-900 dark:text-gray-200'>
                        Create a new meeting
                    </h3>
                    <p className='mt-2 text-center text-sm text-gray-500 dark:text-gray-400'>
                        Analyse your meeting with Sage
                        <br></br>
                        Powered by AI
                        <br></br>
                        <span className='text-xs text-muted-foreground'>Sample meeting here -- <a target='_blank' href="https://assembly.ai/sports_injuries.mp3" className='underline'>https://assembly.ai/sports_injuries.mp3</a></span>
                    </p>
                    <div className="mt-6">
                        <Button disabled={isUploading}>
                            <Upload className='-ml-0.5 mr-1.5 h-5 w-5'></Upload>
                            Upload Meeting 
                            <input className='hidden' {...getInputProps()}></input>
                            <input className='hidden' {...getInputProps()}></input>
                        </Button>
                    </div>
                
                </>
            )}
            {isUploading && (
                <>
                    <CircularProgressbar value={progress} text={`${progress}%`} className='size-20' styles={buildStyles({
                        pathColor: `rgb(255, 255, 0)`,
                        trailColor: `rgb(229, 231, 235)`,
                        textColor: `rgb(255, 255, 255)`
                    })}>
                    </CircularProgressbar>
                    <p>Uploading your meeting {progress}%</p>
                </>
            )}

        </Card>

    </div>
    
  )
}

export default MeetingCard
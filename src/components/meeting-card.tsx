'use client'
import React from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadFile } from '~/lib/firebase'
import { Card } from './ui/card'
import { Presentation, Upload } from 'lucide-react'
import { Button } from './ui/button'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'

const MeetingCard = () => {
    const [isUploading, setIsUploading] = React.useState(false)
    const [progress, setProgress] = React.useState(0)
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            "audio/*": [".mp3", "wav", ".mp4"]
        },
        multiple: false,
        maxSize: 50_000_000,
        onDrop: async (acceptedFiles) => {
            setIsUploading(true);
            const fileDownloadUrl = await uploadFile(acceptedFiles[0] as File, setProgress);
            setIsUploading(false);
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
                    </p>
                    <div className="mt-8">
                        <Button disabled={isUploading}>
                            <Upload className='-ml-0.5 mr-1.5 h-5 w-5'></Upload>
                            Upload Meeting 
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
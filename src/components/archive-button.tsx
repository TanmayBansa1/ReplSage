'use client'
import React from 'react'
import { api } from '~/trpc/react'
import { Button } from './ui/button';
import useProject from '~/hooks/use-project';
import { toast } from 'sonner';
import { Archive } from 'lucide-react';



const ArchiveButton = () => {
    const archive = api.project.archiveProject.useMutation();
    const { selectedProjectID } = useProject();
    const utils = api.useUtils();
  return (
    <div>
        <Button onClick={() => {
            const confirm = window.confirm("Are you sure you want to archive this project? This action cannot be undone.");
            if (confirm) {
                archive.mutate({ projectId: selectedProjectID }, {
                    onSuccess: () => {
                        toast.success("Project archived")
                        utils.project.invalidate()
                    },
                    onError: (err) => {
                        toast.error("Error while archiving project")
                        console.log(err)
                    }
                });
            }
        }} className='' variant={'destructive'}>
            <Archive></Archive>
        </Button>
    </div>
  )
}

export default ArchiveButton
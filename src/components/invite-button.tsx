'use client'
import React from 'react'
import { Button } from './ui/button'
import useProject from '~/hooks/use-project'
import { toast } from 'sonner'
import { Dialog, DialogHeader, DialogTitle, DialogContent } from './ui/dialog'

const InviteButton = () => {
    const [open, setOpen] = React.useState(false)
    const {selectedProjectID} = useProject();
  return (
    <div>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>

            <DialogHeader>
                <DialogTitle>
                    Invite Team Members
                </DialogTitle>
                <span className='mt-4 text-gray-500'>Ask them to join the project using the link below</span>
            </DialogHeader>
            <input className='mt-4 bg-inherit border border-gray-300 rounded-full p-4 text-sm' readOnly onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/join/${selectedProjectID}`)
                toast("Link copied to clipboard")
            }} value={`${window.location.origin}/join/${selectedProjectID}`} />
            </DialogContent>
        </Dialog>
        <Button onClick={() => {
            setOpen(true)
        }}>
            Invite Members
        </Button>
    </div>
  )
}

export default InviteButton
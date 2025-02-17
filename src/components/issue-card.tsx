import React from 'react'
import { RouterOutputs } from '~/trpc/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTitle } from './ui/dialog'


type Props = {
    issue: NonNullable<RouterOutputs["project"]["getMeetingbyId"]>["issues"][number]
}

const IssueCard = ({ issue }: Props) => {
    const [open, setOpen] = React.useState(false)

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{issue.gist}</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className='text-gray-600'>
                        {issue.createdAt.toLocaleString()}
                    </DialogDescription>
                    <p className='text-gray-600'>{issue.headline}</p>
                    <blockquote className='mt-2 border-l-4 border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950'>
                        <span className='text-sm text-gray-600'>
                            {issue.start} - {issue.end}
                        </span>
                        <span className='font-medium italic leading-relaxed text-gray-700 dark:text-gray-400 ml-2'>
                            {issue.summary}
                        </span>

                    </blockquote>
                </DialogContent>
            </Dialog>
            <Card className='relative'>
                <CardHeader>
                    <CardTitle className='text-xl'>
                        {issue.gist}
                    </CardTitle>
                    <Separator></Separator>
                    <CardDescription className=''>
                        {issue.headline}
                    </CardDescription>
                    <CardContent className='flex items-center justify-center '>
                        <Button onClick={() => setOpen(true)} variant={'default'} className='w-full mt-4'>
                            Details
                        </Button>
                    </CardContent>
                </CardHeader>

            </Card>
        </>
    )
}

export default IssueCard
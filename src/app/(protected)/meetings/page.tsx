'use client'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'
import MeetingCard from '~/components/meeting-card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import useProject from '~/hooks/use-project'
import { api } from '~/trpc/react'

type Props = {}

const Meetings = (props: Props) => {
    const { selectedProjectID } = useProject()
    const { data: meetings, isLoading } = api.project.getMeetings.useQuery({ projectId: selectedProjectID }, {
        refetchInterval: 10000
    })
    const deleteMeeting = api.project.deleteMeeting.useMutation();
    const utils = api.useUtils();
    return (
        <div>
            <MeetingCard></MeetingCard>
            <div className='h-6'></div>

            {meetings?.length == 0 ? (
                <div className='text-gray-800 dark:text-gray-200 text-xl font-bold'>
                    No meetings
                </div>
            ) : <div className='text-gray-800 dark:text-gray-200 text-xl font-bold'>
                Meetings
            </div>}
            {isLoading && <div className='text-gray-800 dark:text-gray-200 text-xl font-bold'>
                Loading Meetings
            </div>}
            <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
                {meetings?.map((meeting, index) => (
                    <li key={index} className='py-5 gap-x-6 flex items-center justify-between '>
                        <div>
                            <div className='min-w-0'>
                                <div className='flex items-center gap-2'>
                                    <Link href={`/meetings/${meeting.id}`} className='text-sm font-semibold'>
                                        {meeting.name}
                                    </Link>
                                    {meeting.status === 'PROCESSING' && (
                                        <Badge className='bg-yellow-500 text-white'>Processing</Badge>
                                    )}

                                </div>

                            </div>

                            <div className='flex items-center text-gray-500 text-xs gap-x-2'>
                                <p className='whitespace-nowrap'>
                                    {meeting.createdAt.toLocaleDateString()}
                                </p>
                                <p className='truncate'>
                                    {meeting.issues.length} issues
                                </p>

                            </div>

                        </div>
                        <div className='flex items-center flex-none gap-x-4'>
                            <Link href={`/meetings/${meeting.id}`}>
                                <Button variant={'outline'}>

                                    View Meeting
                                </Button>
                            </Link>
                            <Button variant={'destructive'} disabled={deleteMeeting.isPending} onClick={() => deleteMeeting.mutate({ meetingId: meeting.id }
                                , {
                                    onSuccess: () => {
                                        toast.success("Meeting deleted")
                                        utils.project.getMeetings.invalidate()
                                    },
                                    onError: (err) => {
                                        toast.error("Error while deleting meeting")
                                    }
                                }
                            )}>
                                {deleteMeeting.isPending ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </li>
                ))}

            </ul>
        </div>
    )
}

export default Meetings
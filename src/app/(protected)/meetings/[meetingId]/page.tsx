import React from 'react'
import IssueList from '~/components/issue-list'

type Props = {
    params: Promise<{meetingId: string}>
}

const MeetingDetails = async (props: Props) => {
    const {meetingId} = await props.params
  return (
    <div>
      <IssueList meetingId={meetingId}></IssueList>
    </div>
  )
}

export default MeetingDetails
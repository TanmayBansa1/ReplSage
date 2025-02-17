'use client'
import React from 'react'
import useProject from '~/hooks/use-project'
import { api } from '~/trpc/react';

const TeamMembers = () => {
    const {selectedProjectID} = useProject();
    const {data: members, isLoading} = api.project.getTeamMembers.useQuery({projectId: selectedProjectID})
  return (
    <div>
        {members?.map((member, index) => (
                <img key={index} className='rounded-full w-8 h-8 hover:animate-pulse hover:scale-105' src={member.user.imageUrl ?? ""} alt={member.user.firstName ?? ""} />
            
        ))}
    </div>
  )
}

export default TeamMembers
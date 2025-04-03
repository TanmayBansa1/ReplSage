'use client'
import React from 'react'
import useProject from '~/hooks/use-project'
import { api } from '~/trpc/react';
import Image from 'next/image';
const TeamMembers = () => {
    const {selectedProjectID} = useProject();
    const {data: members} = api.project.getTeamMembers.useQuery({projectId: selectedProjectID})
  return (
    <div>
        {members?.map((member, index) => (
                <Image width={32} height={32} key={index} className='rounded-full w-8 h-8 hover:animate-pulse hover:scale-105' src={member.user.imageUrl ?? ""} alt={member.user.firstName ?? ""} />
            
        ))}
    </div>
  )
}

export default TeamMembers
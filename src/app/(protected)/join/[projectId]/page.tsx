import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '~/server/db'

type Props = {
    params: Promise<{ projectId: string }>
}

const JoinHandler = async (props: Props) => {
    const { projectId } = await props.params

    const {userId} = await auth();
    if(!userId){
        redirect('/sign-in')
    }

    const dbUser = await db.user.findUnique({
        where: {
            id: userId
        }
    })
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)

    if(!dbUser){
        await db.user.create({
            data: {
                id: userId,
                email: user.emailAddresses[0]?.emailAddress ?? "",
                firstName: user.firstName ,
                lastName: user.lastName ,
                imageUrl: user.imageUrl ,
            }
        })
    }
    const project = await db.project.findUnique({
        where: {
            id: projectId
        }
    })
    if(!project){
        redirect('/dashboard')
    }

    try{
        console.log(userId, projectId)
        if (!userId || !projectId) {
            throw new Error('Invalid user or project')
        }

        await db.userToProject.create({
            data: {
                userId: userId,
                projectId: projectId
            }
        })
    }catch (e){
        console.error('You are already a member of this project',e )
    }
    return redirect('/dashboard')
}

export default JoinHandler
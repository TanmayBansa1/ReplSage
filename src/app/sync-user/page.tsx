'use server'
import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { db } from '~/server/db'
import { redirect } from 'next/navigation'

const SyncUser = async () => {
    const {userId} = await auth();
    const client = await clerkClient();
    if(!userId) {
        throw new Error("Unauthorized");
        
    };
    const user = await client.users.getUser(userId);
    if(!user.emailAddresses[0]?.emailAddress){
        throw new Error("User not found");
    }  
    await db.user.upsert({
        where:{
            email: user.emailAddresses[0]?.emailAddress
        },
        update:{
            email: user.emailAddresses[0]?.emailAddress || "",
            firstName: user.firstName ,
            lastName: user.lastName ,
        },
        create:{
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress || "",
            firstName: user.firstName ,
            lastName: user.lastName ,
            imageUrl: user.imageUrl ,
        }
    })
    return redirect('/dashboard')
}

export default SyncUser
//stripe webhook 
import { Stripe } from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { db } from '~/server/db'

const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET!)
export const POST = async (req: NextRequest) => {
    const body = await req.text()
    const signature = (await headers()).get('Stripe-Signature') as string;
    let event: Stripe.Event
    try{
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
        console.log(event)
    }catch(err){
        console.log(err)
        return NextResponse.json({error: 'Invalid event || signature not found'}, {status: 400})
    }

    const session = event.data.object as Stripe.Checkout.Session

    if(event.type === 'checkout.session.completed'){
        console.log('Session completed')
        const userId = session.client_reference_id
        const credits = session.metadata?.["credits"]
        console.log(userId, credits)
        if(!userId || !credits){
            return NextResponse.json({error: 'Invalid userId or credits missing, unexpected error'}, {status: 400})
        }
        
        await db.stripeTransaction.create({
            data: {
                userId: userId,
                credits: Number(credits)
            }
        })
        await db.user.update({
            where: {
                id: userId
            },
            data: {
                credits: {
                    increment: Number(credits)
                }
            }
        })
        return NextResponse.json({success: true, message: "Credits added successfully"}, {status: 200})
    }
}
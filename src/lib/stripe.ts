'use server'
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createCheckoutSession(credits: number){
    const {userId} = await auth()
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${credits} Sage Credits`,
                    },
                    unit_amount: Math.round( (credits/50)*100),
                },
                quantity: 1,
            },
        ],
        customer_creation: 'always',
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_URL}/billing`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/billing`,
        client_reference_id: userId!.toString(),
        metadata: {
            credits: credits
        }
    });
    return redirect(session.url!);
}
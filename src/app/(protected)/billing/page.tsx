'use client'
import { Info } from 'lucide-react';
import React from 'react'
import { Button } from '~/components/ui/button';
import { Slider } from '~/components/ui/slider';
import { createCheckoutSession } from '~/lib/stripe';
import { api } from '~/trpc/react'

const BillingPage = () => {
    const {data: user} = api.project.getCredits.useQuery();
    const [creditsTobuy, setCreditsTobuy] = React.useState<number[]>([100]);
    const creditsTobuyAmount = creditsTobuy[0]!;
    const price = Math.round(creditsTobuyAmount/50).toFixed(0);
  return (
    <div>
        <h1 className='text-xl font-semibold'>Billing</h1>
        <p className='mt-4 text-gray-600'>
            You currently have {user?.credits} credits
        </p>
        <div className='mt-4 bg-blue-100 dark:bg-slate-800 px-4 py-2 rounded-lg border border-blue-200 dark:border-slate-600 text-blue-500'>
            <div className='flex items-center gap-2'>
                <Info className='size-4'></Info>
                <p className='text-sm'>Each credit allows you to index 1 file in a repository</p>
            </div>
            <p className='text-sm'>E.g If your project has 10 files, you would need 10 credits to index it</p>

        </div>
        <div className='mt-4'>
            <Slider defaultValue={[100]} max={1000} min={10} step={10} onValueChange={value=>setCreditsTobuy(value)} value={creditsTobuy}>

            </Slider>

        </div>
        <div className='mt-4'>
            <Button onClick={() => {
                createCheckoutSession(creditsTobuyAmount);
            }}>
                Buy {creditsTobuyAmount} credits for ${price}
            </Button>

        </div>
    </div>
  )
}

export default BillingPage
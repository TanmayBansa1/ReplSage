'use client'
import {  CreditCard, ArrowRight } from 'lucide-react';
import React from 'react'
import { Button } from '~/components/ui/button';
import { Slider } from '~/components/ui/slider';
import { createCheckoutSession } from '~/lib/stripe';
import { api } from '~/trpc/react'
import { motion } from 'framer-motion'

const CreditTier = ({ credits, price, description, recommended = false }: {
    credits: number;
    price: string;
    description: string;
    recommended?: boolean;
}) => (
    <motion.div 
        whileHover={{ scale: 1.05 }}
        className={`
            p-6 rounded-2xl border-2 transition-all duration-300 
            ${recommended 
                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' 
                : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700'}
            flex flex-col justify-between
        `}
    >
        <div>
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-xl font-bold text-gray-800 dark:text-white'>
                    {credits} Credits
                </h3>
                {recommended && (
                    <span className='bg-blue-500 text-white text-xs px-2 py-1 rounded-full'>
                        Best Value
                    </span>
                )}
            </div>
            <p className='text-gray-600 dark:text-gray-300 mb-4'>{description}</p>
        </div>
        <div className='flex items-center justify-between'>
            <span className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                ${price}
            </span>
            <Button 
                onClick={() => createCheckoutSession(credits)}
                variant={recommended ? 'default' : 'outline'}
                className='flex items-center gap-2'
            >
                Purchase <ArrowRight className='size-4' />
            </Button>
        </div>
    </motion.div>
)

const BillingPage = () => {
    const {data: user} = api.project.getCredits.useQuery();
    const [creditsTobuy, setCreditsTobuy] = React.useState<number[]>([100]);
    const creditsTobuyAmount = creditsTobuy[0]!;
    const price = Math.round(creditsTobuyAmount/50).toFixed(0);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4 md:px-12'
        >
            <div className='max-w-7xl mx-auto'>
                {/* Header Section */}
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className='mb-12 text-center'
                >
                    <div className='flex justify-center items-center gap-4 mb-4'>
                        <CreditCard className='size-10 text-blue-500' />
                        <h1 className='text-4xl font-bold text-gray-800 dark:text-white'>
                            Billing & Credits
                        </h1>
                    </div>
                    <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
                        Boost your productivity with our flexible credit system. Purchase credits to unlock powerful features across our platform.
                    </p>
                </motion.div>

                {/* Current Credits Section */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 mb-12 border border-gray-100 dark:border-slate-700'
                >
                    <div className='flex justify-between items-center'>
                        <div>
                            <h2 className='text-2xl font-semibold text-gray-800 dark:text-white mb-2'>
                                Your Current Credits
                            </h2>
                            <p className='text-gray-600 dark:text-gray-300'>
                                Available for use across all your projects
                            </p>
                        </div>
                        <div className='text-4xl font-bold text-blue-600 dark:text-blue-400'>
                            {user?.credits}
                        </div>
                    </div>
                </motion.div>

                {/* Credit Tiers Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className='grid md:grid-cols-3 gap-6 mb-12'
                >
                    <CreditTier 
                        credits={100} 
                        price={Math.round(100/50).toFixed(0)} 
                        description="Perfect for small projects and getting started"
                    />
                    <CreditTier 
                        credits={500} 
                        price={Math.round(500/50).toFixed(0)} 
                        description="Ideal for medium-sized projects with more complex needs"
                        recommended 
                    />
                    <CreditTier 
                        credits={1000} 
                        price={Math.round(1000/50).toFixed(0)} 
                        description="Comprehensive package for large-scale projects"
                    />
                </motion.div>

                {/* Custom Credit Purchase */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-slate-700'
                >
                    <h2 className='text-2xl font-semibold text-gray-800 dark:text-white mb-6'>
                        Custom Credit Purchase
                    </h2>
                    <div className='grid md:grid-cols-2 gap-6 items-center'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4'>
                                Select Number of Credits
                            </label>
                            <Slider 
                                defaultValue={[100]} 
                                max={1000} 
                                min={10} 
                                step={10} 
                                onValueChange={value => setCreditsTobuy(value)} 
                                value={creditsTobuy}
                                className='w-full'
                            />
                            <div className='mt-4 text-sm text-gray-500 dark:text-gray-400'>
                                {creditsTobuyAmount} credits | ${price} total
                            </div>
                        </div>
                        <div>
                            <Button 
                                onClick={() => createCheckoutSession(creditsTobuyAmount)}
                                size="lg"
                                className='w-full bg-blue-500 hover:bg-blue-600 transition-colors duration-300'
                            >
                                Purchase Custom Credits
                            </Button>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-2 text-center'>
                                Flexible purchasing tailored to your exact needs
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default BillingPage
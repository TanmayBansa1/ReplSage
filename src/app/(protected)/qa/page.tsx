'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet';
import QuestionCard from '~/components/ask-question-card';
import useProject from '~/hooks/use-project'
import { api } from '~/trpc/react';
import CodeReferences from '~/components/code-references';
import MDEditor from '@uiw/react-md-editor';
import { FileText, Search, Clock, FileCode } from 'lucide-react';
import { Badge } from '~/components/ui/badge';

const QNApage = () => {
    const { selectedProjectID } = useProject();
    const { data: questions, isLoading } = api.project.getQuestions.useQuery({ projectId: selectedProjectID })
    const [questionIndex, setQuestionIndex] = React.useState(0)
    const question = questions?.[questionIndex]

    // Animation variants for questions list
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { 
            opacity: 0, 
            y: 50 
        },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        }
    };


    return (
        <Sheet>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className='p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen'
            >
                <QuestionCard />
                <div className="h-8"></div>

                {isLoading ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='flex justify-center items-center h-full'
                    >
                        <div className='text-center'>
                            <motion.div 
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 10, -10, 0]
                                }}
                                transition={{ 
                                    duration: 1,
                                    repeat: Infinity,
                                    repeatType: "loop"
                                }}
                            >
                                <Search className='mx-auto size-12 text-gray-400' />
                            </motion.div>
                            <p className='mt-4 text-gray-600 text-xl font-bold'>
                                Loading Questions
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center'>
                            <FileText className='mr-3 size-6 text-blue-600 dark:text-blue-400' />
                            {questions?.length ?? 0 > 0 ? `${questions?.length} Questions` : 'No Questions saved'}
                        </h2>

                        <AnimatePresence>
                            <motion.div 
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                variants={containerVariants}
                            >
                                {questions?.map((question, index) => (
                                    <motion.div 
                                        key={question.id}
                                        variants={itemVariants}
                                        whileHover={{ 
                                            scale: 1.02, 
                                            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)" 
                                        }}
                                        className='group'
                                    >
                                        <SheetTrigger 
                                            onClick={() => setQuestionIndex(index)}
                                            className='w-full'
                                        >
                                            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden p-6 space-y-4">
                                                <div className='flex items-center justify-between'>
                                                    <div className='flex items-center gap-4'>
                                                        <Image 
                                                            width={40} 
                                                            height={40} 
                                                            className='rounded-full w-10 h-10 border-2 border-blue-100 dark:border-blue-900' 
                                                            src={question.user.imageUrl ?? ""} 
                                                            alt={question.user.firstName ?? ""} 
                                                        />
                                                        <div>
                                                            <p className='text-gray-900 dark:text-white text-lg font-bold line-clamp-1'>
                                                                {question.user.firstName}
                                                            </p>
                                                            <p className='text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2'>
                                                                <Clock className='size-4' />
                                                                {question.createdAt.toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge 
                                                        className={`bg-blue-400 rounded-full px-2 py-1 text-xs`}
                                                            >
                                                        <FileCode className='size-3 mr-1' />
                                                        
                                                        {
                                                        //@ts-expect-error says length doesnt exist on number
                                                        question.fileReferences?.length ?? 0} Refs
                                                    </Badge> 
                                                </div>
                                                <div className='space-y-2'>
                                                    <p className='text-gray-800 dark:text-gray-200 font-semibold line-clamp-2'>
                                                        {question.question}
                                                    </p>
                                                    <p className='text-gray-600 dark:text-gray-400 text-sm line-clamp-3'>
                                                        {question.answer}
                                                    </p>
                                                </div>
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className='mt-4'
                                                >
                                                    <div className='w-full h-1 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden'>
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: '100%' }}
                                                            transition={{ duration: 0.5 }}
                                                            className='h-full bg-blue-500 dark:bg-blue-600'
                                                        />
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </SheetTrigger>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                )}
            </motion.div>

            {question && (
                <SheetContent className='sm:max-w-[80vw]'>
                    <SheetHeader>
                        <SheetTitle>
                            {question.question}
                        </SheetTitle>
                        <MDEditor.Markdown 
                            source={question.answer ?? ""} 
                            className='max-w-[70vw] !h-full max-h-[40vh] overflow-scroll no-scrollbar p-3 bg-gray-200 dark:bg-gray-800'
                        />
                        <CodeReferences fileReferences={question.fileReferences as any[]}/>
                    </SheetHeader>
                </SheetContent>
            )}
        </Sheet>
    )
}

export default QNApage;
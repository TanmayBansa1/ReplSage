'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet';
import { Button } from '~/components/ui/button';
import QuestionCard from '~/components/ask-question-card';
import useProject from '~/hooks/use-project'
import { api } from '~/trpc/react';
import CodeReferences from '~/components/code-references';
import MDEditor from '@uiw/react-md-editor';

const QNApage = () => {
    const { selectedProjectID } = useProject();
    console.log(selectedProjectID)
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
                duration: 0.5
            }
        }
    };

    return (
        <Sheet>
            <QuestionCard></QuestionCard>
            <div className="h-8"></div>
            {isLoading ? <div>Loading Questions...</div> : <div className="text-xl font-semibold"> {questions?.length ?? 0 > 0 ? `${questions?.length} Questions` : 'No Questions saved'}</div>}
            <div className="h-4"></div>
            
            <motion.div 
                className="flex flex-col gap-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {questions?.map((question, index) => (
                    <motion.div 
                        key={question.id}
                        variants={itemVariants}
                        viewport={{ once: true }}
                    >
                        <SheetTrigger onClick={() => setQuestionIndex(index)}>
                            <div className="flex items-center gap-4 bg-white dark:bg-gray-950 rounded-lg p-4 shadow border hover:shadow-md transition-shadow">
                                <Image 
                                    width={32} 
                                    height={32} 
                                    className='rounded-full w-8 h-8' 
                                    src={question.user.imageUrl ?? ""} 
                                    alt={question.user.firstName ?? ""} 
                                />
                                <div className="text-left flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <p className='text-gray-700 line-clamp-1 text-lg font-medium dark:text-white'>
                                            {question.question}
                                        </p>
                                        <span className='text-xs text-gray-400 whitespace-nowrap'>
                                            {question.createdAt.toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className='text-gray-500 line-clamp-1 text-sm'>
                                        {question.answer}
                                    </p>
                                </div>
                            </div>
                        </SheetTrigger>
                    </motion.div>
                ))}
            </motion.div>

            {question && (
                <SheetContent className='sm:max-w-[80vw]'>
                    <SheetHeader>
                        <SheetTitle>
                            {question.question}

                        </SheetTitle>
                        <MDEditor.Markdown source={question.answer ?? ""} className='max-w-[70vw] !h-full max-h-[40vh] overflow-scroll no-scrollbar p-3 bg-gray-200'></MDEditor.Markdown>
                        <CodeReferences fileReferences={question.fileReferences as any[]}></CodeReferences>
                    </SheetHeader>

                </SheetContent>
            )}
        </Sheet>
    )
}

export default QNApage;
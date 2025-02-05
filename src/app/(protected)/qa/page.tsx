'use client'
import MDEditor from '@uiw/react-md-editor';
import React from 'react'
import QuestionCard from '~/components/ask-question-card';
import CodeReferences from '~/components/code-references';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet';
import useProject from '~/hooks/use-project'
import { api } from '~/trpc/react';


const QNApage = () => {
    const { selectedProjectID } = useProject();
    console.log(selectedProjectID)
    const { data: questions } = api.project.getQuestions.useQuery({ projectId: selectedProjectID })
    const [questionIndex, setQuestionIndex] = React.useState(0)
    const question = questions?.[questionIndex]
    return (
        <Sheet>
            <QuestionCard></QuestionCard>
            <div className="h-4"></div>
            <div className="text-xl font-semibold">Saved Questions</div>
            <div className="h-4"></div>
            <div className="flex flex-col gap-2">
                {questions?.map((question, index) => {
                    return (
                        <React.Fragment key={question.id}>
                            <SheetTrigger onClick={() => setQuestionIndex(index)}>
                                <div className="flex items-center gap-4 bg-white dark:bg-gray-950 rounded-lg p-4 shadow border">
                                    <img className='rounded-full w-8 h-8' src={question.user.imageUrl ?? ""} alt={question.user.firstName ?? ""} />
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
                        </React.Fragment>
                    )
                })}
            </div>

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

export default QNApage
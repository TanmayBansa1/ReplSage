'use client'
import React from 'react'
import { motion } from 'framer-motion'
import useProject from '~/hooks/use-project'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { SnowflakeIcon } from 'lucide-react'
import { Dialog, DialogTitle, DialogContent, DialogHeader } from './ui/dialog'
import Image from 'next/image'
import { askQuestion } from '~/lib/gemini'
import { toast } from 'sonner'
import { readStreamableValue } from 'ai/rsc'
import MDeditor from '@uiw/react-md-editor'
import CodeReferences from './code-references'
import { api } from '~/trpc/react'
import Typewriter from 'typewriter-effect';

const QuestionCard = () => {
  const { project } = useProject()
  const [question, setQuestion] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [fileReferences, setFileReferences] = React.useState<{fileName: string, sourceCode: string, summary: string}[]>([]);
  const [answer, setAnswer] = React.useState('');
  const saveAnswer = api.project.saveAnswer.useMutation();
  const onSubmit = async (e: React.FormEvent) => {
    setAnswer('')
    setFileReferences([]);
    e.preventDefault();
    setLoading(true);
    if(project?.id === null || project?.id === undefined || project === undefined){
      toast.error("Project ID is not defined")
      throw new Error("Project ID is not defined at the Question Card")
    }
    try{
      const { output, fileReferences } = await askQuestion(question, project.id);
      setOpen(true);
      setFileReferences(fileReferences);
      for await (const chunk of readStreamableValue(output)){
        if(chunk){
          setAnswer(ans => ans + chunk);
        }
      }
      setLoading(false)
    }catch(err){
      setLoading(false);
      toast.error("Error while sending question to the server")
      setOpen(false)
      console.log("error while sending question",err)
      throw err;
    }
  }
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className='sm:max-w-[70vw] no-scrollbar overflow-scroll max-h-[90vh] p-2 m-2'
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2 justify-between p-4'>
                <Image src='/logo.png' alt='sage' width={72} height={40} />
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className='text-xl font-semibold dark:text-white'
                >
                  {question}
                </motion.span>
                <Button 
                  disabled={saveAnswer.isPending} 
                  variant={'outline'} 
                  className="transition-all duration-300 hover:scale-105 active:scale-95"
                  onClick={()=>{
                    setOpen(false)
                    saveAnswer.mutate(
                      {
                        projectId: project!.id,
                        question,
                        answer,
                        fileReferences
                      },
                      {
                        onSuccess: ()=>{
                          toast.success("Answer saved")
                        },
                        onError: (err)=>{
                          console.log( "error while saving answer",err )
                          toast.error("Error while saving answer")
                        }
                      }
                    )
                  }}
                >
                  Save Answer
                </Button>
              </DialogTitle>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <MDeditor.Markdown 
                source={answer} 
                className='max-w-[70vw] !h-full max-h-[40vh] overflow-scroll no-scrollbar p-3 bg-gray-200' 
              /> 
              <CodeReferences fileReferences={fileReferences} />
            </motion.div>
            <Button 
              type='button' 
              className="transition-all duration-300 hover:scale-105 active:scale-95"
              onClick={()=>{
                setOpen(false)
              }}
            >
              Close
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Card 
          className='relative col-span-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] bg-gradient-to-br from-white/90 to-blue-50/50 dark:from-gray-900/90 dark:to-blue-950/50 border-2 border-blue-100/50 dark:border-blue-900/30 rounded-xl p-4'
        >
          <CardHeader className='space-y-3 pb-4 '>
            <CardTitle className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400'>
              <Typewriter
                options={{
                  strings: ['Ask a question'],
                  autoStart: true,
                  loop: true
                }}
              />
            </CardTitle>
            <p className='text-xs text-gray-600 dark:text-gray-300 max-w-xl'>
              It can take up to 6 minutes after you have created your project for Sage to understand your repository before it can answer questions. Feel free to explore and ask about your project&apos;s details.
            </p>
          </CardHeader>
          <CardContent className='space-y-5'>
            <form onSubmit={onSubmit} className='space-y-4'>
              <Textarea 
                className='text-2xl font-medium text-gray-800 dark:text-gray-200 bg-white/70 dark:bg-gray-800/70 border-2 border-blue-100 dark:border-blue-900/30 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 transition-all duration-300 min-h-[80px]' 
                placeholder={`how do i edit the favicon in ${project?.name} ?`} 
                onChange={(e) => setQuestion(e.target.value)} 
              />
              <Button 
                type='submit' 
                className='w-full transition-all duration-300 hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg text-lg py-3 mt-2' 
                disabled={loading}
              >
                Ask Sage <SnowflakeIcon className="ml-3 h-6 w-6 animate-pulse" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default QuestionCard
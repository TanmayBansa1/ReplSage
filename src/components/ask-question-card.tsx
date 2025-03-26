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
      >
        <Card 
          className='relative col-span-3 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]'
        >
          <CardHeader>
            <CardTitle className='text-2xl font-semibold'>
            <Typewriter
              options={{
                strings: ['Ask a question'],
                autoStart: true
              }}
              />
            </CardTitle>
            <p className='text-xs text-muted-foreground'>It can take up to 6 minutes after you have created your project for Sage to understand your repository before it can answer questions </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit}>
              <Textarea 
                className='text-xl font-semibold' 
                placeholder={`how do i edit the favicon in ${project?.name} ?`} 
                onChange={(e) => setQuestion(e.target.value)} 
              />
              <Button 
                type='submit' 
                className='mt-3 w-fit transition-all duration-300 hover:scale-105 active:scale-95' 
                disabled={loading}
              >
                Ask Sage <SnowflakeIcon className="ml-2 animate-pulse" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default QuestionCard
'use client'
import React from 'react'
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

const QuestionCard = () => {
  const { project } = useProject()
  const [question, setQuestion] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [fileReferences, setFileReferences] = React.useState<{fileName: string, sourceCode: string, summary: string}[]>([]);
  const [answer, setAnswer] = React.useState('');
  // console.log(answer)
  const saveAnswer = api.project.saveAnswer.useMutation();
  const onSubmit = async (e: React.FormEvent) => {
    // console.log(question)
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
        <DialogContent className='sm:max-w-[70vw] no-scrollbar overflow-scroll max-h-[90vh] p-2 m-2'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 justify-between p-4'>
              <Image src='/logo.png' alt='sage' width={72} height={40} />
              <span className='text-xl font-semibold dark:text-white'>{question}</span>
              <Button disabled={saveAnswer.isPending} variant={'outline'} onClick={()=>{
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

              }}>
                Save Answer

              </Button>
            </DialogTitle>
          </DialogHeader>
          {/* Add dialog content here */}
          <MDeditor.Markdown source={answer} className='max-w-[70vw] !h-full max-h-[40vh] overflow-scroll no-scrollbar p-3 bg-gray-200' /> 
          <CodeReferences fileReferences={fileReferences} />
          <Button type='button' onClick={()=>{
            setOpen(false)
          }}>Close</Button>
          
        </DialogContent>
      </Dialog>
      <Card className='relative col-span-3'>
        <CardHeader>
          <CardTitle className='text-2xl font-semibold'>
            Ask a question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Textarea className='text-xl font-semibold' placeholder={`how do i edit the favicon in ${project?.name} ?`} onChange={(e) => setQuestion(e.target.value)} />
            <Button type='submit' className='mt-4 w-fit' disabled={loading}>
              Ask Sage <SnowflakeIcon />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default QuestionCard
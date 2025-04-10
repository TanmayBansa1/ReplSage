'use client'
import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { api } from '~/trpc/react'
import { Info } from 'lucide-react'
interface FormInput {
    name: string,
    url: string,
    githubToken?: string
}
const CreateProject = () => {
    const { register, handleSubmit, reset } = useForm<FormInput>()
    const createProject = api.project.createProject.useMutation();
    const checkCredits = api.project.checkCredits.useMutation();
    const utils = api.useUtils();
    function submitHandler(data: FormInput) {

        if (checkCredits.data) {

            createProject.mutate({
                name: data.name,
                url: data.url,
                githubToken: data.githubToken || undefined
            }, {
                onSuccess: () => {
                    toast.success('Project created')
                    utils.project.getProjects.invalidate()
                    reset()
                },
                onError: (err) => {
                    console.log(err)
                    toast.error('Something went wrong')
                }
            })
        } else {
            checkCredits.mutate(
                {
                    githubUrl: data.url, githubToken: data.githubToken
                }
            );
        }


    }
    const hasEnoughCredits = checkCredits?.data?.userCredits ? checkCredits.data?.userCredits >= checkCredits.data?.fileCount: true
    return (
        <div className='h-full flex items-center justify-center gap-12'>
            <div>
                <Image src='/undraw_programming_65t2.svg' alt='coding' width={300} height={400}></Image>
            </div>
            <div className='flex flex-col gap-4'>
                <div>
                    <h2 className='text-3xl font-bold text-primary'>Link your repository</h2>
                    <p className='text-muted-foreground'>Add a link to your GitHub repository</p>
                </div>
                <div>
                    <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-4'>
                        <Input required {...register("name")} placeholder='Enter the name of your Project'></Input>
                        <Input type='url' required {...register("url")} placeholder='Enter the URL of your Project'></Input>
                        <Input {...register("githubToken")} placeholder='Enter your GitHub Token (Optional)'></Input>

                        {checkCredits.data && (
                            <div className='mt-4 bg-orange-100 px-4 -y-2 rounded-lg border border-orange-200 text-orange-500 '>
                                <div className='flex items-center gap-2'>
                                    <Info className='size-4'></Info>
                                    <p className='text-sm'>You will be charged <strong>{checkCredits.data?.fileCount}</strong>credits for this repository</p>
                                </div>
                                <p className='text-sm text-blue-600 ml-6'>You have <strong>{checkCredits.data?.userCredits}</strong> credits remaining</p>
                            </div>
                        )}
                        <Button disabled={createProject.isPending || checkCredits.isPending || !hasEnoughCredits} type='submit'>{checkCredits.data ? "Create Project" : "Check Credits"}</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateProject
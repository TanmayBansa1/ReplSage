'use client'
import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

interface FormInput {
    name: string,
    url: string,
    githubToken?: string
}
const CreateProject = () => {
    const { register, handleSubmit, reset } = useForm<FormInput>()

    function submitHandler(data: FormInput) {
        console.log(data)
        alert(JSON.stringify(data))
    }

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
                        <Button type='submit'> Create Project</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateProject
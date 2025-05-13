import { SignIn } from '@clerk/nextjs'
import { Info } from 'lucide-react'

export default function Page() {
  return     <div className='flex flex-col justify-center items-center h-screen g-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] '>
  <div className='max-w-md p-4 m-4 flex items-center gap-1 rounded-full bg-purple-300'>
    <Info className='w-8 h-8 text-purple-900' />
    <p className='text-purple-900 text-sm text-center'>ReplSage is still under development. Please use test@example.com. The pass is test@123@123</p>

  </div>
  <SignIn 
  initialValues={{
    emailAddress: 'test@example.com',
  }}/>
  </div> 
}


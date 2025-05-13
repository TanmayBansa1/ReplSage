import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <div className='flex justify-center items-center h-screen g-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] '>
    {/* <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div> */}

  <SignIn 
  initialValues={{
    emailAddress: 'test@example.com',
  }}/>
  </div> 
}


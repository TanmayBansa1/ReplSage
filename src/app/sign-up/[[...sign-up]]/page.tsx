import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='flex justify-center items-center h-screen g-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] '>

      <SignUp initialValues={{
        emailAddress: 'test@example.com'
      }}/>
    </div>
  )
}
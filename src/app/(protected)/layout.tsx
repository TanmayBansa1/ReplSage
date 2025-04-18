import { UserButton } from '@clerk/nextjs';
import React from 'react'
import { SidebarProvider } from '~/components/ui/sidebar';
import AppSidebar from '~/components/app-sidebar';
import { ModeToggle } from '~/components/ModeToggle';

type Props = {
    children: React.ReactNode;
}

const SidebarLayout = ({children}: Props) => {
  return (
    <SidebarProvider>
        <AppSidebar></AppSidebar>
        <main className='w-full  m-2 '>
            <div className='flex items-center gap-2 border-sidebar-border bg-sidebar border shadow rounded-md p-2 px-4 '>
                {/* <searchbar></searchbar> */}
                <div className='ml-auto'></div>
                <ModeToggle></ModeToggle>
                <UserButton></UserButton>

            </div>
            <div className='h-4'></div>
            {/* main content */}
            <div className='border-sidebar-border border shadow rounded-md overflow-y-scroll h-[calc(100vh-6rem)] p-4 no-scrollbar'>
                {children }
            </div>

        </main>
    </SidebarProvider>
  )
}

export default SidebarLayout
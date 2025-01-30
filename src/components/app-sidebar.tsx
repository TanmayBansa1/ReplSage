'use client'
import { Bot, CreditCardIcon, LayoutDashboard, Plus, Presentation } from "lucide-react"

import Link from "next/link"
import { redirect, usePathname } from "next/navigation"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "~/components/ui/sidebar"
import { cn } from "~/lib/utils"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import Image from "next/image"
const items = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Q&A",
        href: "/qa",
        icon: Bot,
    },
    {
        title: "Meetings",
        href: "/meetings",
        icon: Presentation,
    },
    {
        title: "Billing",
        href: "/billing",
        icon: CreditCardIcon,
    }
]
const projects = [
    {
        name: "Project 1",
    },
    {
        name: "Project 2",
    },
    {
        name: "Project 3"
    }
]
export default function AppSidebar() {
    const pathname = usePathname()
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader >
                <div>
                    <Link href="/" className="flex items-center gap-1">
                        <Image src="/logo.png" alt="logo" width={84} height={56} />
                        <span className="text-2xl font-bold">ReplSage</span>
                    </Link>
                </div>
            </SidebarHeader>
            <Separator></Separator>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        APPLICATION
                    </SidebarGroupLabel>
                    <SidebarGroupContent >
                        <SidebarMenu>

                            {
                                items.map((item, index) => (
                                    <SidebarMenuItem key={index}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.href} className={cn("hover:bg-primary/50", { 'bg-primary text-white': pathname === item.href })}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <Separator></Separator>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        PROJECTS
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* {render the projects here} */}
                            {projects.map((project, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild>
                                        <div className="hover:bg-primary/50">
                                            <div className={cn('border-slate-400 border rounded-lg size-6 bg-white text-primary text-sm flex items-center justify-center hover:bg-primary/50', { 'bg-primary rounded-lg text-white': true })}>
                                                {project.name[0]?.toUpperCase()}
                                            </div>
                                            <span>{project.name}</span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <Separator></Separator>
                <SidebarGroup>
                    <SidebarGroupContent className="flex justify-center items-center">

                        <Button variant="outline" onClick={()=>{
                            redirect('/create')
                        }}>
                            {<Plus></Plus>}Create Project
                        </Button>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}

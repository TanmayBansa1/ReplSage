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
    useSidebar,
} from "~/components/ui/sidebar"
import { cn } from "~/lib/utils"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import Image from "next/image"
import useProject from "~/hooks/use-project"
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

// const projects = [
//     {
//         name: "Project 1",
//     },
//     {
//         name: "Project 2",
//     },
//     {
//         name: "Project 3"
//     }
// ]
export default function AppSidebar() {
    const pathname = usePathname()
    const { open } = useSidebar()
    const { projects, selectedProjectID, setSelectedProjectID, project } = useProject()

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader >
                <div>
                    <Link href="/" className="flex items-center gap-1">
                        <Image src="/logo.png" alt="logo" width={84} height={56} />
                        {open && (
                            <span className="text-2xl font-bold text-primary">ReplSage</span>
                        )}
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
                                            <Link href={item.href} className={cn("hover:bg-slate-200 dark:hover:bg-slate-800", { 'bg-primary text-white': pathname === item.href })}>
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
                        YOUR PROJECTS
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* {render the projects here} */}
                            {projects?.map((project, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild onClick={() => setSelectedProjectID(project.id)}>
                                        <div className="hover:bg-slate-200 dark:hover:bg-slate-800">
                                            <div className={cn('border-slate-400 border rounded-lg size-6 bg-white text-primary text-sm flex items-center justify-center hover:bg-slate-200', { 'bg-primary rounded-lg text-white': selectedProjectID === project.id })}>
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
                    <SidebarGroupContent >
                        <SidebarMenu className="flex justify-center items-center">
                            <SidebarMenuItem >
                                <SidebarMenuButton asChild>
                                    {open ? (

                                        
                                        <Button variant="outline" onClick={() => {
                                            redirect('/create')
                                        }}>
                                        {<Plus></Plus>}Create Project
                                    </Button>
                                        ): (
                                            <Button variant="outline" onClick={() => {
                                                redirect('/create')
                                            }}>
                                            {<Plus></Plus>}
                                        </Button>)
                                    }
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}

'use client'
import { Bot, CreditCardIcon, LayoutDashboard, Zap, Presentation, FolderPlus } from "lucide-react"
import Link from "next/link"
import { redirect, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
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
import useProject from "~/hooks/use-project"
import { useState, useEffect } from "react"

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

const ProjectItem = ({ 
    project, 
    isSelected, 
    onSelect, 
    index 
}: { 
    project: { id: string, name: string }, 
    isSelected: boolean, 
    onSelect: (id: string) => void,
    index: number
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 20
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <SidebarMenuItem>
                <SidebarMenuButton 
                    asChild 
                    onClick={() => onSelect(project.id)}
                >
                    <div 
                        className={cn(
                            "flex items-center gap-3 w-full p-2 rounded-lg transition-all duration-300 group",
                            "hover:bg-slate-100 dark:hover:bg-slate-800",
                            {
                                "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700": isSelected,
                            }
                        )}
                    >
                        <div 
                            className={cn(
                                'border-slate-400 border rounded-lg size-8 dark:text-white text-sm flex items-center justify-center',
                                'transition-all duration-300 group-hover:border-primary',
                                {
                                    'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700': isSelected,
                                    'bg-white dark:bg-slate-900': !isSelected
                                }
                            )}
                        >
                            {project.name[0]?.toUpperCase()}
                        </div>
                        <span 
                            className={cn(
                                "text-sm font-medium transition-colors duration-300",
                                "dark:group-hover:text-white",
                                {
                                    "dark:text-white font-semibold": isSelected,
                                    "text-slate-600 dark:text-slate-300": !isSelected
                                }
                            )}
                        >
                            {project.name}
                        </span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </motion.div>
    )
}

export default function AppSidebar() {
    const pathname = usePathname()
    const { open } = useSidebar()
    const { projects, selectedProjectID, setSelectedProjectID } = useProject()
    const [isProjectsLoaded, setIsProjectsLoaded] = useState(false)

    useEffect(() => {
        if (projects && projects.length > 0) {
            const timer = setTimeout(() => {
                setIsProjectsLoaded(true)
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [projects])

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link href="/" className="flex items-center gap-1">
                        <Zap className="size-8 text-primary my-6 mx-3" />
                        {open && (
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">ReplSage</span>
                        )}
                    </Link>
                </motion.div>
            </SidebarHeader>
            <Separator />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>APPLICATION</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <AnimatePresence>
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ 
                                            delay: index * 0.1,
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20
                                        }}
                                    >
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <Link 
                                                    href={item.href} 
                                                    className={cn(
                                                        "hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center gap-3 p-2 rounded-lg transition-all duration-300",
                                                        { 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700': pathname === item.href }
                                                    )}
                                                >
                                                    <item.icon className="size-5" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <Separator />
                <SidebarGroup>
                    <SidebarGroupLabel>{projects?.length ? "YOUR PROJECTS" : "NO PROJECTS"}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <AnimatePresence>
                                {!isProjectsLoaded && projects?.length !==0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex justify-center items-center py-4"
                                    >
                                        <div className="animate-pulse flex space-x-4">
                                            <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-8 w-8"></div>
                                            <div className="flex-1 space-y-3 py-1">
                                                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                                                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    projects?.map((project, index) => (
                                        <ProjectItem 
                                            key={project.id}
                                            project={project}
                                            isSelected={selectedProjectID === project.id}
                                            onSelect={setSelectedProjectID}
                                            index={index}
                                        />
                                    ))
                                )}
                            </AnimatePresence>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <Separator />
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="flex justify-center items-center">
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {open ? (
                                            <Button 
                                                variant="outline" 
                                                onClick={() => redirect('/create')}
                                                className="flex items-center gap-2 group"
                                            >
                                                <FolderPlus className="size-4 group-hover:text-primary transition-colors" />
                                                Create Project
                                            </Button>
                                        ) : (
                                            <Button 
                                                variant="outline" 
                                                onClick={() => redirect('/create')}
                                                className="p-2"
                                            >
                                                <FolderPlus className="size-4" />
                                            </Button>
                                        )}
                                    </motion.div>
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

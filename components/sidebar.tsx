"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, LayoutDashboard, Bot, Box, Settings, ChevronLeft, ChevronRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Sandbox", href: "/sandbox", icon: Box },
    { name: "Bot", href: "/bot", icon: Bot },
    { name: "Settings", href: "/settings", icon: Settings },
]

const Sidebar = () => {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    const toggleCollapse = () => {
        setCollapsed(!collapsed)
    }

    const SidebarContent = () => (
        <div className={cn("h-full flex flex-col border-r bg-background", collapsed ? "w-16" : "w-64")}>
            <div className="flex items-center justify-between p-4 border-b">
                {!collapsed && (
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <Bot className="h-6 w-6" />
                        <span className="font-bold text-xl">Omniflow</span>
                    </Link>
                )}
                {collapsed && (
                    <Link href="/dashboard">
                        <Bot className="h-6 w-6 mx-auto" />
                    </Link>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleCollapse}
                    className={cn("hidden md:flex", collapsed && "mx-auto")}
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>
            <div className="flex-1 py-4 overflow-y-auto">
                <nav className="space-y-1 px-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                pathname === item.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                collapsed && "justify-center",
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", collapsed ? "mx-0" : "mr-3")} />
                            {!collapsed && <span>{item.name}</span>}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="p-4 border-t">
                {!collapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-medium">JO</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Jimleston Osoi</p>
                            <p className="text-xs text-muted-foreground">Admin</p>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <span className="text-primary font-medium">JO</span>
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-50">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}

export default Sidebar


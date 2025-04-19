"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Map, User, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Navigation() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  // Don't show navigation on welcome, login, and signup pages
  const hideNavigation = ["/welcome", "/login", "/signup"].includes(pathname)

  if (hideNavigation) {
    return null
  }

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      description: "View your feed",
    },
    {
      name: "Discover",
      href: "/discover",
      icon: Search,
      description: "Find new recommendations",
    },
    {
      name: "Map",
      href: "/map",
      icon: Map,
      description: "Explore geotagged murmurs",
    },
    {
      name: "Messages",
      href: "/messages",
      icon: MessageSquare,
      description: "Your conversations",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      description: "View your profile",
    },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-muted bg-card shadow-periwinkle-sm"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around p-2">
        <TooltipProvider>
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
                      isActive ? "text-accent" : "text-muted-foreground hover:text-accent",
                      isActive && "bg-background/70",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon className="h-6 w-6" />
                    <span className="text-xs mt-1">{item.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{item.description}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </div>
    </nav>
  )
}

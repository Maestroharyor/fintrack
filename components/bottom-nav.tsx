"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, TrendingDown, TrendingUp, PieChart, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/expenses", icon: TrendingDown, label: "Expenses" },
  { href: "/income", icon: TrendingUp, label: "Income" },
  { href: "/budget", icon: PieChart, label: "Budget" },
  { href: "/more", icon: MoreHorizontal, label: "More" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t md:hidden">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs transition-all duration-200 rounded-lg",
                isActive
                  ? "text-primary bg-gradient-to-t from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

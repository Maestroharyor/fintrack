"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useFinanceStore } from "@/lib/store"
import {
  Search,
  Home,
  TrendingDown,
  TrendingUp,
  PieChart,
  Target,
  Repeat,
  Settings,
  Bell,
  Plus,
  Calculator,
} from "lucide-react"

const navigationItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: TrendingDown, label: "Expenses", href: "/expenses" },
  { icon: TrendingUp, label: "Income", href: "/income" },
  { icon: PieChart, label: "Budget", href: "/budget" },
  { icon: Target, label: "Goals", href: "/goals" },
  { icon: Repeat, label: "Recurring", href: "/recurring" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

const quickActions = [
  { icon: Plus, label: "Add Transaction", action: "add-transaction" },
  { icon: Calculator, label: "Quick Calculator", action: "calculator" },
  { icon: Target, label: "Add Goal", action: "add-goal" },
]

export function SearchCommand() {
  const [open, setOpen] = useState(false)
  const { transactions } = useFinanceStore()
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (value: string) => {
    setOpen(false)

    if (value.startsWith("/")) {
      router.push(value)
    } else if (value === "add-transaction") {
      // Trigger transaction modal (you'd implement this)
      console.log("Open transaction modal")
    } else if (value === "calculator") {
      // Open calculator (you'd implement this)
      console.log("Open calculator")
    } else if (value === "add-goal") {
      router.push("/goals")
    }
  }

  // Recent transactions for search
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search transactions, navigate, or perform actions..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Navigation">
            {navigationItems.map((item) => (
              <CommandItem key={item.href} value={item.href} onSelect={handleSelect}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Quick Actions">
            {quickActions.map((item) => (
              <CommandItem key={item.action} value={item.action} onSelect={handleSelect}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Recent Transactions">
            {recentTransactions.map((transaction) => (
              <CommandItem key={transaction.id} value={`transaction-${transaction.id}`} onSelect={() => setOpen(false)}>
                {transaction.type === "income" ? (
                  <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="mr-2 h-4 w-4 text-red-600" />
                )}
                <span>{transaction.description}</span>
                <span className="ml-auto text-xs text-muted-foreground">{transaction.category}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Search trigger button */}
      <div
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted/50 rounded-md cursor-pointer hover:bg-muted transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </>
  )
}

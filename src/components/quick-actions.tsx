"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFinanceStore } from "@/lib/store"
import { Zap, Coffee, Car, ShoppingCart, Utensils, CreditCard, TrendingUp, TrendingDown } from "lucide-react"

const quickExpenses = [
  { icon: Coffee, label: "Coffee", amount: 500, category: "Food" },
  { icon: Car, label: "Fuel", amount: 5000, category: "Transport" },
  { icon: Utensils, label: "Lunch", amount: 1500, category: "Food" },
  { icon: ShoppingCart, label: "Groceries", amount: 8000, category: "Food" },
  { icon: CreditCard, label: "Bills", amount: 15000, category: "Utilities" },
]

const quickIncomes = [
  { icon: TrendingUp, label: "Salary", amount: 150000, category: "Salary" },
  { icon: TrendingUp, label: "Freelance", amount: 25000, category: "Freelance" },
]

export function QuickActions() {
  const { addTransaction, settings } = useFinanceStore()
  const [recentlyAdded, setRecentlyAdded] = useState<string[]>([])

  const handleQuickAdd = (item: (typeof quickExpenses)[0], type: "income" | "expense") => {
    addTransaction({
      type,
      amount: item.amount,
      category: item.category,
      description: item.label,
      date: new Date().toISOString().split("T")[0],
    })

    const key = `${type}-${item.label}`
    setRecentlyAdded((prev) => [...prev, key])

    // Remove from recently added after 3 seconds
    setTimeout(() => {
      setRecentlyAdded((prev) => prev.filter((k) => k !== key))
    }, 3000)
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-blue-700 dark:text-blue-300">Quick Actions</h3>
        </div>

        <div className="space-y-4">
          {/* Quick Expenses */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              Quick Expenses
            </h4>
            <div className="flex flex-wrap gap-2">
              {quickExpenses.map((item) => {
                const key = `expense-${item.label}`
                const isRecentlyAdded = recentlyAdded.includes(key)

                return (
                  <Button
                    key={item.label}
                    variant={isRecentlyAdded ? "default" : "outline-solid"}
                    size="sm"
                    onClick={() => handleQuickAdd(item, "expense")}
                    className={`h-auto p-2 flex flex-col items-center gap-1 min-w-[70px] ${
                      isRecentlyAdded
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "hover:bg-red-50 dark:hover:bg-red-950"
                    }`}
                    disabled={isRecentlyAdded}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-xs">{item.label}</span>
                    <span className="text-xs font-medium">{formatAmount(item.amount)}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Quick Income */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Quick Income
            </h4>
            <div className="flex flex-wrap gap-2">
              {quickIncomes.map((item) => {
                const key = `income-${item.label}`
                const isRecentlyAdded = recentlyAdded.includes(key)

                return (
                  <Button
                    key={item.label}
                    variant={isRecentlyAdded ? "default" : "outline-solid"}
                    size="sm"
                    onClick={() => handleQuickAdd(item, "income")}
                    className={`h-auto p-2 flex flex-col items-center gap-1 min-w-[70px] ${
                      isRecentlyAdded
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "hover:bg-green-50 dark:hover:bg-green-950"
                    }`}
                    disabled={isRecentlyAdded}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-xs">{item.label}</span>
                    <span className="text-xs font-medium">{formatAmount(item.amount)}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

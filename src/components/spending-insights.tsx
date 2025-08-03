"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFinanceStore } from "@/lib/store"
import { TrendingUp, TrendingDown, AlertTriangle, Target, Calendar } from "lucide-react"

export function SpendingInsights() {
  const { transactions, budgets, settings, currentMonth } = useFinanceStore()

  // Get current and previous month data
  const currentDate = new Date(currentMonth + "-01")
  const prevDate = new Date(currentDate)
  prevDate.setMonth(prevDate.getMonth() - 1)
  const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`

  const currentMonthTransactions = transactions.filter((t) => t.date.startsWith(currentMonth))
  const prevMonthTransactions = transactions.filter((t) => t.date.startsWith(prevMonth))

  const currentExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const prevExpenses = prevMonthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const expenseChange = prevExpenses > 0 ? ((currentExpenses - prevExpenses) / prevExpenses) * 100 : 0

  // Category analysis
  const categorySpending = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>,
    )

  const topCategory = Object.entries(categorySpending).sort(([, a], [, b]) => b - a)[0]

  // Budget alerts
  const budgetAlerts = budgets.filter((budget) => {
    const spent = categorySpending[budget.category] || 0
    const percentage = (spent / budget.amount) * 100
    return percentage > 80
  })

  // Days left in month
  const today = new Date()
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  const daysLeft = Math.max(0, lastDay.getDate() - today.getDate())

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const insights = [
    {
      type: expenseChange > 0 ? "warning" : "success",
      icon: expenseChange > 0 ? TrendingUp : TrendingDown,
      title: `${Math.abs(expenseChange).toFixed(1)}% ${expenseChange > 0 ? "increase" : "decrease"}`,
      description: "in spending vs last month",
      color: expenseChange > 0 ? "text-orange-600" : "text-green-600",
    },
    ...(topCategory
      ? [
          {
            type: "info" as const,
            icon: Target,
            title: `${topCategory[0]} is your top expense`,
            description: `${formatAmount(topCategory[1])} spent this month`,
            color: "text-blue-600",
          },
        ]
      : []),
    ...(budgetAlerts.length > 0
      ? [
          {
            type: "warning" as const,
            icon: AlertTriangle,
            title: `${budgetAlerts.length} budget${budgetAlerts.length > 1 ? "s" : ""} over 80%`,
            description: "Consider reducing spending",
            color: "text-red-600",
          },
        ]
      : []),
    {
      type: "info" as const,
      icon: Calendar,
      title: `${daysLeft} days left`,
      description: "in this month",
      color: "text-purple-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
          Smart Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <div
                className={`p-1 rounded-full ${
                  insight.type === "warning"
                    ? "bg-orange-100 dark:bg-orange-950"
                    : insight.type === "success"
                      ? "bg-green-100 dark:bg-green-950"
                      : "bg-blue-100 dark:bg-blue-950"
                }`}
              >
                <insight.icon className={`h-4 w-4 ${insight.color}`} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{insight.title}</p>
                <p className="text-xs text-muted-foreground">{insight.description}</p>
              </div>
              <Badge variant={insight.type === "warning" ? "destructive" : "secondary"} className="text-xs">
                {insight.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

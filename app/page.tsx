"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MonthSelector } from "@/components/month-selector"
import { BudgetProgress } from "@/components/budget-progress"
import { GoalTracker } from "@/components/goal-tracker"
import { QuickActions } from "@/components/quick-actions"
import { SpendingInsights } from "@/components/spending-insights"
import { RecentActivity } from "@/components/recent-activity"
import { SearchCommand } from "@/components/search-command"
import { FloatingCalculator } from "@/components/floating-calculator"
import { useFinanceStore } from "@/lib/store"
import { TrendingUp, TrendingDown, PiggyBank, Eye, EyeOff } from "lucide-react"
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Dashboard() {
  const { transactions, budgets, goals, settings, currentMonth } = useFinanceStore()
  const [showAmounts, setShowAmounts] = useState(true)

  // Filter transactions for current month
  const currentMonthTransactions = transactions.filter((t) => t.date.startsWith(currentMonth))

  // Calculate totals
  const totalIncome = currentMonthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalSavings = totalIncome - totalExpenses

  // Prepare chart data
  const expensesByCategory = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>,
    )

  const pieData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
  }))

  const monthlyData = [
    { month: "Oct", income: 145000, expenses: 89000 },
    { month: "Nov", income: 152000, expenses: 95000 },
    { month: "Dec", income: 148000, expenses: 87000 },
    { month: "Jan", income: totalIncome, expenses: totalExpenses },
  ]

  const formatAmount = (amount: number) => {
    if (!showAmounts) return "****"
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back! Here's your financial overview</p>
        </div>
        <div className="flex items-center gap-2">
          <SearchCommand />
          <Button variant="outline" size="icon" onClick={() => setShowAmounts(!showAmounts)} className="h-8 w-8">
            {showAmounts ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
          <MonthSelector />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Total Income</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatAmount(totalIncome)}</div>
            <p className="text-xs text-green-600/70 dark:text-green-400/70">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 border-red-200 dark:border-red-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Total Expenses</CardTitle>
            <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{formatAmount(totalExpenses)}</div>
            <p className="text-xs text-red-600/70 dark:text-red-400/70">-5% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Net Savings</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <PiggyBank className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${totalSavings >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}
            >
              {formatAmount(totalSavings)}
            </div>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
              {totalSavings >= 0 ? "Great job saving!" : "Consider reducing expenses"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Insights and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingInsights />
        <RecentActivity />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              Expenses by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Amount",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              Monthly Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                income: {
                  label: "Income",
                  color: "hsl(var(--chart-1))",
                },
                expenses: {
                  label: "Expenses",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Budget Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-orange-500"></div>
          Budget Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.slice(0, 3).map((budget) => (
            <BudgetProgress key={budget.id} budget={budget} />
          ))}
        </div>
      </div>

      {/* Goals */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          Savings Goals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.slice(0, 2).map((goal) => (
            <GoalTracker key={goal.id} goal={goal} />
          ))}
        </div>
      </div>

      {/* Floating Calculator */}
      <FloatingCalculator />
    </div>
  )
}

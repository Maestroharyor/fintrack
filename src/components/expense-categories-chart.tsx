"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinanceStore } from "@/lib/store"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16"]

export function ExpenseCategoriesChart() {
  const { transactions, currentMonth, settings } = useFinanceStore()

  const currentMonthExpenses = transactions.filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))

  const categoryData = currentMonthExpenses.reduce(
    (acc, transaction) => {
      const existing = acc.find((item) => item.name === transaction.category)
      if (existing) {
        existing.value += transaction.amount
      } else {
        acc.push({
          name: transaction.category,
          value: transaction.amount,
        })
      }
      return acc
    },
    [] as { name: string; value: number }[],
  )

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">{formatAmount(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  if (categoryData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            <p>No expense data for this month</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

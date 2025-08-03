"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFinanceStore } from "@/lib/store"
import { Clock, TrendingUp, TrendingDown } from "lucide-react"

export function RecentActivity() {
  const { transactions, settings } = useFinanceStore()

  // Get last 5 transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: string) => {
    const today = new Date()
    const transactionDate = new Date(date)
    const diffTime = Math.abs(today.getTime() - transactionDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return transactionDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div
                className={`p-2 rounded-full ${
                  transaction.type === "income" ? "bg-green-100 dark:bg-green-950" : "bg-red-100 dark:bg-red-950"
                }`}
              >
                {transaction.type === "income" ? (
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">{transaction.description}</p>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {transaction.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
              </div>

              <div className="text-right">
                <p
                  className={`font-semibold text-sm ${
                    transaction.type === "income"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatAmount(transaction.amount)}
                </p>
                {transaction.completed && (
                  <Badge variant="secondary" className="text-xs">
                    Done
                  </Badge>
                )}
              </div>
            </div>
          ))}

          {recentTransactions.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No recent transactions</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

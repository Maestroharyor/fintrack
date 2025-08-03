"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useFinanceStore, type Budget } from "@/lib/store"

interface BudgetProgressProps {
  budget: Budget
}

export function BudgetProgress({ budget }: BudgetProgressProps) {
  const { settings } = useFinanceStore()

  const percentage = (budget.spent / budget.amount) * 100
  const remaining = budget.amount - budget.spent

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{budget.category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Spent: {formatAmount(budget.spent)}</span>
            <span>Budget: {formatAmount(budget.amount)}</span>
          </div>
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{percentage.toFixed(1)}% used</span>
            <span>{formatAmount(remaining)} remaining</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

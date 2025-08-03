"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useFinanceStore, type Goal } from "@/lib/store"

interface GoalTrackerProps {
  goal: Goal
}

export function GoalTracker({ goal }: GoalTrackerProps) {
  const { settings } = useFinanceStore()

  const percentage = (goal.currentAmount / goal.targetAmount) * 100
  const remaining = goal.targetAmount - goal.currentAmount

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{goal.name}</CardTitle>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {goal.description && <p className="text-sm text-muted-foreground">{goal.description}</p>}

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current: {formatAmount(goal.currentAmount)}</span>
              <span>Target: {formatAmount(goal.targetAmount)}</span>
            </div>
            <Progress value={percentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{percentage.toFixed(1)}% complete</span>
              <span>{formatAmount(remaining)} to go</span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">Deadline: {formatDate(goal.deadline)}</div>
        </div>
      </CardContent>
    </Card>
  )
}

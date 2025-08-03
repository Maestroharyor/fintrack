"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MonthSelector } from "@/components/month-selector"
import { BudgetProgress } from "@/components/budget-progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFinanceStore } from "@/lib/store"
import { Plus, TrendingDown } from "lucide-react"

export default function BudgetPage() {
  const { budgets, addBudget, settings, currentMonth, transactions } = useFinanceStore()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
  })

  // Calculate current month expenses by category
  const currentMonthExpenses = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
    .reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>,
    )

  // Update budgets with current spending
  const updatedBudgets = budgets.map((budget) => ({
    ...budget,
    spent: currentMonthExpenses[budget.category] || 0,
  }))

  const totalBudget = updatedBudgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = updatedBudgets.reduce((sum, b) => sum + b.spent, 0)
  const totalRemaining = totalBudget - totalSpent

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.category || !formData.amount) return

    addBudget({
      category: formData.category,
      amount: Number.parseFloat(formData.amount),
      spent: currentMonthExpenses[formData.category] || 0,
      month: currentMonth,
    })

    setFormData({ category: "", amount: "" })
    setOpen(false)
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Budget</h1>
        <MonthSelector />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(totalBudget)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatAmount(totalSpent)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalRemaining >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatAmount(totalRemaining)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Budget Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Budget
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Budget</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {settings.categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Budget Amount ({settings.currency})</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Add Budget
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Budget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {updatedBudgets.map((budget) => (
          <BudgetProgress key={budget.id} budget={budget} />
        ))}
      </div>

      {updatedBudgets.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No budgets set for this month.</p>
            <p className="text-sm text-muted-foreground mt-2">Click "Add Budget" to create your first budget.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useFinanceStore } from "@/lib/store"
import { Plus, Repeat, Edit, Trash2 } from "lucide-react"
import { MobileHeader } from "@/components/mobile-header"

export default function RecurringPage() {
  const { transactions, addTransaction, settings } = useFinanceStore()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    recurrenceType: "monthly",
  })

  // Filter recurring transactions
  const recurringTransactions = transactions.filter((t) => t.recurring)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount || !formData.category) return

    addTransaction({
      type: formData.type as "income" | "expense",
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: new Date().toISOString().split("T")[0],
      recurring: true,
      recurrenceType: formData.recurrenceType as "weekly" | "monthly" | "yearly",
    })

    setFormData({
      type: "expense",
      amount: "",
      category: "",
      description: "",
      recurrenceType: "monthly",
    })
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
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <MobileHeader title="Recurring Transactions" />

      <div className="p-4 space-y-6">
        <div className="hidden md:flex items-center justify-between">
          <h1 className="text-2xl font-bold">Recurring Transactions</h1>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <Card className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Recurring</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Repeat className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{recurringTransactions.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Monthly Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatAmount(
                  recurringTransactions
                    .filter((t) => t.recurrenceType === "monthly")
                    .reduce((sum, t) => sum + (t.type === "income" ? t.amount : -t.amount), 0),
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Recurring Transaction Button */}
        <div className="w-full">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Recurring Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle>Add Recurring Transaction</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ({settings.currency})</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>

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
                  <Label htmlFor="recurrenceType">Recurrence</Label>
                  <Select
                    value={formData.recurrenceType}
                    onValueChange={(value) => setFormData({ ...formData, recurrenceType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description of recurring transaction"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Add Recurring Transaction
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Recurring Transactions List */}
        <div className="space-y-4 w-full">
          {recurringTransactions.map((transaction) => (
            <Card key={transaction.id} className="w-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-medium truncate">{transaction.description}</h3>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {transaction.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        <Repeat className="h-3 w-3 mr-1" />
                        {transaction.recurrenceType}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {transaction.type === "income" ? "Income" : "Expense"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`font-semibold text-sm ${transaction.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatAmount(transaction.amount)}
                    </span>

                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {recurringTransactions.length === 0 && (
          <Card className="w-full">
            <CardContent className="p-8 text-center">
              <Repeat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recurring transactions set up.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Click "Add Recurring Transaction" to automate your regular income and expenses.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

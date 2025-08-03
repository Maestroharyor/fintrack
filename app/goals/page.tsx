"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GoalTracker } from "@/components/goal-tracker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useFinanceStore } from "@/lib/store"
import { Plus, Target } from "lucide-react"
import { MobileHeader } from "@/components/mobile-header"

export default function GoalsPage() {
  const { goals, addGoal, settings } = useFinanceStore()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.targetAmount || !formData.deadline) return

    addGoal({
      name: formData.name,
      targetAmount: Number.parseFloat(formData.targetAmount),
      currentAmount: Number.parseFloat(formData.currentAmount) || 0,
      deadline: formData.deadline,
      description: formData.description,
    })

    setFormData({
      name: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
      description: "",
    })
    setOpen(false)
  }

  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <MobileHeader title="Savings Goals" />

      <div className="p-4 space-y-6">
        <div className="hidden md:flex items-center justify-between">
          <h1 className="text-2xl font-bold">Savings Goals</h1>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Goals</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{goals.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Total Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatAmount(totalCurrentAmount)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {overallProgress.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Goal Button */}
        <div className="w-full">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle>Add Savings Goal</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Goal Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Emergency Fund"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Target Amount ({settings.currency})</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentAmount">Current Amount ({settings.currency})</Label>
                  <Input
                    id="currentAmount"
                    type="number"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Target Date</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of your goal"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Add Goal
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Goals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {goals.map((goal) => (
            <GoalTracker key={goal.id} goal={goal} />
          ))}
        </div>

        {goals.length === 0 && (
          <Card className="w-full">
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No savings goals yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Click "Add Goal" to create your first savings goal.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GoalTracker } from "@/components/goal-tracker";
import { useGoals, useSettings, useFinanceActions } from "@/lib/store";
import { Target, Plus, Calendar } from "lucide-react";

export default function GoalsPage() {
  const goals = useGoals();
  const settings = useSettings();
  const { addGoal } = useFinanceActions();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    description: "",
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount || !formData.deadline) return;

    addGoal({
      name: formData.name,
      targetAmount: Number.parseFloat(formData.targetAmount),
      currentAmount: Number.parseFloat(formData.currentAmount) || 0,
      deadline: formData.deadline,
      description: formData.description,
    });

    setFormData({
      name: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
      description: "",
    });
    setOpen(false);
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalProgress =
    totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-600 flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Goals</h1>
                <p className="text-sm text-muted-foreground">
                  Track your financial goals and savings targets
                </p>
              </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-lg">
                    <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    Add New Goal
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Goal Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Emergency Fund, Vacation, New Car"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="targetAmount">Target Amount</Label>
                      <Input
                        id="targetAmount"
                        type="number"
                        placeholder="0.00"
                        value={formData.targetAmount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            targetAmount: e.target.value,
                          })
                        }
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentAmount">Current Amount</Label>
                      <Input
                        id="currentAmount"
                        type="number"
                        placeholder="0.00"
                        value={formData.currentAmount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currentAmount: e.target.value,
                          })
                        }
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Target Date</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData({ ...formData, deadline: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Add any additional details about your goal..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Add Goal
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                Total Target
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {formatAmount(totalTarget)}
              </p>
              <p className="text-sm text-muted-foreground">
                {goals.length} goals set
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="h-3 w-3 rounded-full bg-green-600"></div>
                Total Saved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {formatAmount(totalCurrent)}
              </p>
              <p className="text-sm text-muted-foreground">
                {totalProgress.toFixed(1)}% progress
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="h-3 w-3 rounded-full bg-purple-600"></div>
                Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">
                {formatAmount(totalTarget - totalCurrent)}
              </p>
              <p className="text-sm text-muted-foreground">
                {totalTarget - totalCurrent > 0
                  ? "To reach goals"
                  : "Goals achieved!"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Goals List */}
        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-600"></div>
            Your Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.length === 0 ? (
              <Card className="border shadow-sm col-span-full">
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No goals set</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first financial goal to start tracking your
                    progress
                  </p>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Goal
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[500px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-lg">
                          <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                            <Target className="h-4 w-4 text-white" />
                          </div>
                          Add New Goal
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Goal Name</Label>
                          <Input
                            id="name"
                            placeholder="e.g., Emergency Fund, Vacation, New Car"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="targetAmount">Target Amount</Label>
                            <Input
                              id="targetAmount"
                              type="number"
                              placeholder="0.00"
                              value={formData.targetAmount}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  targetAmount: e.target.value,
                                })
                              }
                              step="0.01"
                              min="0"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="currentAmount">
                              Current Amount
                            </Label>
                            <Input
                              id="currentAmount"
                              type="number"
                              placeholder="0.00"
                              value={formData.currentAmount}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  currentAmount: e.target.value,
                                })
                              }
                              step="0.01"
                              min="0"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="deadline">Target Date</Label>
                          <Input
                            id="deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                deadline: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">
                            Description (Optional)
                          </Label>
                          <Textarea
                            id="description"
                            placeholder="Add any additional details about your goal..."
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            rows={3}
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Add Goal
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ) : (
              goals.map((goal) => <GoalTracker key={goal.id} goal={goal} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

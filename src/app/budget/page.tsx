"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BudgetProgress } from "@/components/budget-progress";
import {
  useBudgets,
  useSettings,
  useCurrentMonth,
  useTransactions,
  useFinanceActions,
} from "@/lib/store";
import { Target, Plus } from "lucide-react";

export default function BudgetPage() {
  const budgets = useBudgets();
  const settings = useSettings();
  const currentMonth = useCurrentMonth();
  const transactions = useTransactions();
  const { addBudget } = useFinanceActions();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
  });

  // Filter budgets for current month
  const currentMonthBudgets = budgets.filter((b) => b.month === currentMonth);

  // Calculate spent amounts for each budget
  const budgetsWithSpent = currentMonthBudgets.map((budget) => {
    const spent = transactions
      .filter(
        (t) =>
          t.date.startsWith(currentMonth) &&
          t.type === "expense" &&
          t.category === budget.category
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return { ...budget, spent };
  });

  const totalBudget = budgetsWithSpent.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgetsWithSpent.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) return;

    addBudget({
      category: formData.category,
      amount: Number.parseFloat(formData.amount),
      spent: 0,
      month: currentMonth,
    });

    setFormData({ category: "", amount: "" });
    setOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="p-6 space-y-6">
        {/* Add Budget Button */}
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[400px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-lg">
                  <div className="h-8 w-8 rounded-lg bg-yellow-600 flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  Add New Budget
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
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
                  <Label htmlFor="amount">Budget Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Budget
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                Total Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {formatAmount(totalBudget)}
              </p>
              <p className="text-sm text-muted-foreground">
                {budgetsWithSpent.length} categories
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="h-3 w-3 rounded-full bg-red-600"></div>
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {formatAmount(totalSpent)}
              </p>
              <p className="text-sm text-muted-foreground">
                {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="h-3 w-3 rounded-full bg-green-600"></div>
                Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl font-bold ${
                  totalRemaining >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatAmount(totalRemaining)}
              </p>
              <p className="text-sm text-muted-foreground">
                {totalRemaining >= 0 ? "Available" : "Over budget"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress */}
        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-yellow-600"></div>
            Budget Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgetsWithSpent.length === 0 ? (
              <Card className="border shadow-sm col-span-full">
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No budgets set</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first budget to start tracking your spending
                  </p>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Budget
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[400px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-lg">
                          <div className="h-8 w-8 rounded-lg bg-yellow-600 flex items-center justify-center">
                            <Target className="h-4 w-4 text-white" />
                          </div>
                          Add New Budget
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) =>
                              setFormData({ ...formData, category: value })
                            }
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
                          <Label htmlFor="amount">Budget Amount</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                amount: e.target.value,
                              })
                            }
                            step="0.01"
                            min="0"
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Add Budget
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ) : (
              budgetsWithSpent.map((budget) => (
                <BudgetProgress key={budget.id} budget={budget} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

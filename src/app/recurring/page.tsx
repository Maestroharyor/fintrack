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
import { TransactionCard } from "@/components/transaction-card";
import { useTransactions, useSettings, useFinanceActions } from "@/lib/store";
import { Repeat, Plus, Calendar, TrendingUp, TrendingDown } from "lucide-react";

export default function RecurringPage() {
  const transactions = useTransactions();
  const settings = useSettings();
  const { addTransaction } = useFinanceActions();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    recurrenceType: "monthly",
  });

  // Filter recurring transactions
  const recurringTransactions = transactions.filter((t) => t.recurring);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;

    addTransaction({
      type: formData.type as "income" | "expense",
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: new Date().toISOString().split("T")[0],
      recurring: true,
      recurrenceType: formData.recurrenceType as
        | "weekly"
        | "monthly"
        | "yearly",
    });

    setFormData({
      type: "expense",
      amount: "",
      category: "",
      description: "",
      recurrenceType: "monthly",
    });
    setOpen(false);
  };

  const totalRecurringIncome = recurringTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRecurringExpenses = recurringTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-600 flex items-center justify-center">
                <Repeat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Recurring
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage your recurring transactions
                </p>
              </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Recurring
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-lg">
                    <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
                      <Repeat className="h-4 w-4 text-white" />
                    </div>
                    Add Recurring Transaction
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Transaction Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "income" | "expense") =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="expense"
                          className="flex items-center gap-2"
                        >
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          Expense
                        </SelectItem>
                        <SelectItem
                          value="income"
                          className="flex items-center gap-2"
                        >
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          Income
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
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
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="e.g., Netflix subscription, Salary"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recurrenceType">Recurrence</Label>
                    <Select
                      value={formData.recurrenceType}
                      onValueChange={(value: "weekly" | "monthly" | "yearly") =>
                        setFormData({ ...formData, recurrenceType: value })
                      }
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

                  <Button type="submit" className="w-full">
                    Add Recurring Transaction
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
                <div className="h-3 w-3 rounded-full bg-purple-600"></div>
                Total Recurring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">
                {recurringTransactions.length}
              </p>
              <p className="text-sm text-muted-foreground">
                transactions set up
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="h-3 w-3 rounded-full bg-green-600"></div>
                Recurring Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {formatAmount(totalRecurringIncome)}
              </p>
              <p className="text-sm text-muted-foreground">
                {
                  recurringTransactions.filter((t) => t.type === "income")
                    .length
                }{" "}
                sources
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="h-3 w-3 rounded-full bg-red-600"></div>
                Recurring Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {formatAmount(totalRecurringExpenses)}
              </p>
              <p className="text-sm text-muted-foreground">
                {
                  recurringTransactions.filter((t) => t.type === "expense")
                    .length
                }{" "}
                items
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recurring Transactions List */}
        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-purple-600"></div>
            Recurring Transactions
          </h2>
          <div className="space-y-4">
            {recurringTransactions.length === 0 ? (
              <Card className="border shadow-sm">
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Repeat className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No recurring transactions
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Set up recurring transactions to automate your financial
                    tracking
                  </p>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Recurring
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[500px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-lg">
                          <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
                            <Repeat className="h-4 w-4 text-white" />
                          </div>
                          Add Recurring Transaction
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="type">Transaction Type</Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value: "income" | "expense") =>
                              setFormData({ ...formData, type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value="expense"
                                className="flex items-center gap-2"
                              >
                                <TrendingDown className="h-4 w-4 text-red-500" />
                                Expense
                              </SelectItem>
                              <SelectItem
                                value="income"
                                className="flex items-center gap-2"
                              >
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                Income
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount</Label>
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
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            placeholder="e.g., Netflix subscription, Salary"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="recurrenceType">Recurrence</Label>
                          <Select
                            value={formData.recurrenceType}
                            onValueChange={(
                              value: "weekly" | "monthly" | "yearly"
                            ) =>
                              setFormData({
                                ...formData,
                                recurrenceType: value,
                              })
                            }
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

                        <Button type="submit" className="w-full">
                          Add Recurring Transaction
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ) : (
              recurringTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

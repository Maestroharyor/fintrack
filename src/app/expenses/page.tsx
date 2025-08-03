"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionCard } from "@/components/transaction-card";
import { TransactionModal } from "@/components/transaction-modal";
import { useTransactions, useSettings, useCurrentMonth } from "@/lib/store";
import { TrendingDown, Search, Filter, Plus } from "lucide-react";

export default function ExpensesPage() {
  const transactions = useTransactions();
  const settings = useSettings();
  const currentMonth = useCurrentMonth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter transactions for current month and expenses only
  const currentMonthExpenses = useMemo(() => {
    return transactions.filter(
      (t) =>
        t.date.startsWith(currentMonth) &&
        t.type === "expense" &&
        (searchTerm === "" ||
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedCategory === "all" || t.category === selectedCategory)
    );
  }, [transactions, currentMonth, searchTerm, selectedCategory]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      transactions
        .filter((t) => t.date.startsWith(currentMonth) && t.type === "expense")
        .map((t) => t.category)
    );
    return Array.from(uniqueCategories).sort();
  }, [transactions, currentMonth]);

  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    return currentMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthExpenses]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-600 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
                <p className="text-sm text-muted-foreground">
                  Track and manage your expenses
                </p>
              </div>
            </div>
            <TransactionModal type="expense" />
          </div>
        </div>
      </div>

      {/* Filters and Stats */}
      <div className="p-6 space-y-6">
        {/* Summary Card */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="h-3 w-3 rounded-full bg-red-600"></div>
              Monthly Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {formatAmount(totalExpenses)}
                </p>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {currentMonthExpenses.length}
                </p>
                <p className="text-sm text-muted-foreground">Transactions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {categories.length}
                </p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {currentMonthExpenses.length === 0 ? (
            <Card className="border shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <TrendingDown className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No expenses found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedCategory !== "all"
                    ? "Try adjusting your filters"
                    : "Start tracking your expenses"}
                </p>
                <TransactionModal type="expense" />
              </CardContent>
            </Card>
          ) : (
            currentMonthExpenses.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

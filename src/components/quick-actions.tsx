"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSettings, useFinanceActions } from "@/lib/store";
import { TransactionDrawer } from "@/components/transaction-drawer";
import {
  Zap,
  Coffee,
  Car,
  ShoppingCart,
  Utensils,
  CreditCard,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const quickExpenses = [
  { icon: Coffee, label: "Coffee", amount: 500, category: "Food" },
  { icon: Car, label: "Fuel", amount: 5000, category: "Transport" },
  { icon: Utensils, label: "Lunch", amount: 1500, category: "Food" },
  { icon: ShoppingCart, label: "Groceries", amount: 8000, category: "Food" },
  { icon: CreditCard, label: "Bills", amount: 15000, category: "Utilities" },
];

const quickIncomes = [
  { icon: TrendingUp, label: "Salary", amount: 150000, category: "Salary" },
  {
    icon: TrendingUp,
    label: "Freelance",
    amount: 25000,
    category: "Freelance",
  },
];

export function QuickActions() {
  const settings = useSettings();
  const { addTransaction } = useFinanceActions();
  const [recentlyAdded, setRecentlyAdded] = useState<string[]>([]);

  const handleQuickAdd = (
    item: (typeof quickExpenses)[0],
    type: "income" | "expense"
  ) => {
    addTransaction({
      type,
      amount: item.amount,
      category: item.category,
      description: item.label,
      date: new Date().toISOString().split("T")[0],
    });

    const key = `${type}-${item.label}`;
    setRecentlyAdded((prev) => [...prev, key]);

    // Remove from recently added after 3 seconds
    setTimeout(() => {
      setRecentlyAdded((prev) => prev.filter((k) => k !== key));
    }, 3000);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="bg-card border shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="font-semibold text-xl text-foreground">
            Quick Actions
          </h3>
        </div>

        <div className="space-y-6">
          {/* Quick Expenses */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-destructive"></div>
              Quick Expenses
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {quickExpenses.map((item) => {
                const key = `expense-${item.label}`;
                const isRecentlyAdded = recentlyAdded.includes(key);

                return (
                  <TransactionDrawer
                    key={item.label}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-auto p-4 flex flex-col items-center gap-3 min-w-0 rounded-lg border-destructive/20 hover:border-destructive/40 hover:bg-destructive/5 transition-all duration-200 ${
                          isRecentlyAdded
                            ? "bg-primary text-primary-foreground border-primary"
                            : "hover:shadow-sm"
                        }`}
                        disabled={isRecentlyAdded}
                      >
                        <item.icon
                          className={`h-5 w-5 ${
                            isRecentlyAdded
                              ? "text-primary-foreground"
                              : "text-destructive"
                          }`}
                        />
                        <span className="text-xs font-medium">
                          {item.label}
                        </span>
                        <span className="text-xs font-bold tabular-nums">
                          {formatAmount(item.amount)}
                        </span>
                      </Button>
                    }
                    onSave={() => handleQuickAdd(item, "expense")}
                  />
                );
              })}
            </div>
          </div>

          {/* Quick Income */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-600"></div>
              Quick Income
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {quickIncomes.map((item) => {
                const key = `income-${item.label}`;
                const isRecentlyAdded = recentlyAdded.includes(key);

                return (
                  <TransactionDrawer
                    key={item.label}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-auto p-4 flex flex-col items-center gap-3 min-w-0 rounded-lg border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-950/50 transition-all duration-200 ${
                          isRecentlyAdded
                            ? "bg-primary text-primary-foreground border-primary"
                            : "hover:shadow-sm"
                        }`}
                        disabled={isRecentlyAdded}
                      >
                        <item.icon
                          className={`h-5 w-5 ${
                            isRecentlyAdded
                              ? "text-primary-foreground"
                              : "text-green-600 dark:text-green-400"
                          }`}
                        />
                        <span className="text-xs font-medium">
                          {item.label}
                        </span>
                        <span className="text-xs font-bold tabular-nums">
                          {formatAmount(item.amount)}
                        </span>
                      </Button>
                    }
                    onSave={() => handleQuickAdd(item, "income")}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

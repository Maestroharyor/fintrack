"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTransactions, useSettings } from "@/lib/store";
import { Clock, TrendingUp, TrendingDown, Activity } from "lucide-react";

export function RecentActivity() {
  const transactions = useTransactions();
  const settings = useSettings();

  // Get last 5 transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    const today = new Date();
    const transactionDate = new Date(date);
    const diffTime = Math.abs(today.getTime() - transactionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return transactionDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 group border border-transparent hover:border-border ${
                index === 0 ? "bg-muted/30" : ""
              }`}
            >
              <div
                className={`p-2 rounded-lg transition-transform duration-200 group-hover:scale-105 ${
                  transaction.type === "income" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {transaction.type === "income" ? (
                  <TrendingUp className="h-4 w-4 text-white" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm truncate">
                    {transaction.description}
                  </p>
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-0.5 rounded-lg border-0 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 shrink-0"
                  >
                    {transaction.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(transaction.date)}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={`font-bold text-sm tabular-nums ${
                    transaction.type === "income"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatAmount(transaction.amount)}
                </p>
                {transaction.completed && (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-0.5 rounded-lg border-0 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 mt-1"
                  >
                    ✓ Done
                  </Badge>
                )}
              </div>
            </div>
          ))}

          {recentTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">No recent transactions</p>
              <p className="text-xs">
                Start tracking your finances to see activity here
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

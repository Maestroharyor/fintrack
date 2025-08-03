"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useTransactions,
  useBudgets,
  useSettings,
  useCurrentMonth,
} from "@/lib/store";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Calendar,
  Lightbulb,
} from "lucide-react";

export function SpendingInsights() {
  const transactions = useTransactions();
  const budgets = useBudgets();
  const settings = useSettings();
  const currentMonth = useCurrentMonth();

  // Get current and previous month data
  const currentDate = new Date(currentMonth + "-01");
  const prevDate = new Date(currentDate);
  prevDate.setMonth(prevDate.getMonth() - 1);
  const prevMonth = `${prevDate.getFullYear()}-${String(
    prevDate.getMonth() + 1
  ).padStart(2, "0")}`;

  const currentMonthTransactions = transactions.filter((t) =>
    t.date.startsWith(currentMonth)
  );
  const prevMonthTransactions = transactions.filter((t) =>
    t.date.startsWith(prevMonth)
  );

  const currentExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const prevExpenses = prevMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseChange =
    prevExpenses > 0
      ? ((currentExpenses - prevExpenses) / prevExpenses) * 100
      : 0;

  // Category analysis
  const categorySpending = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategory = Object.entries(categorySpending).sort(
    ([, a], [, b]) => b - a
  )[0];

  // Budget alerts
  const budgetAlerts = budgets.filter((budget) => {
    const spent = categorySpending[budget.category] || 0;
    const percentage = (spent / budget.amount) * 100;
    return percentage > 80;
  });

  // Days left in month
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysLeft = Math.max(0, lastDay.getDate() - today.getDate());

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const insights = [
    {
      type: expenseChange > 0 ? "warning" : "success",
      icon: expenseChange > 0 ? TrendingUp : TrendingDown,
      title: `${Math.abs(expenseChange).toFixed(1)}% ${
        expenseChange > 0 ? "increase" : "decrease"
      }`,
      description: "in spending vs last month",
      color:
        expenseChange > 0
          ? "text-orange-600 dark:text-orange-400"
          : "text-green-600 dark:text-green-400",
      bgColor:
        expenseChange > 0
          ? "bg-orange-100 dark:bg-orange-950/50"
          : "bg-green-100 dark:bg-green-950/50",
    },
    ...(topCategory
      ? [
          {
            type: "info" as const,
            icon: Target,
            title: `${topCategory[0]} is your top expense`,
            description: `${formatAmount(topCategory[1])} spent this month`,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-950/50",
          },
        ]
      : []),
    ...(budgetAlerts.length > 0
      ? [
          {
            type: "warning" as const,
            icon: AlertTriangle,
            title: `${budgetAlerts.length} budget${
              budgetAlerts.length > 1 ? "s" : ""
            } over 80%`,
            description: "Consider reducing spending",
            color: "text-red-600 dark:text-red-400",
            bgColor: "bg-red-100 dark:bg-red-950/50",
          },
        ]
      : []),
    {
      type: "info" as const,
      icon: Calendar,
      title: `${daysLeft} days left`,
      description: "in this month",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-950/50",
    },
  ];

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="h-8 w-8 rounded-lg bg-yellow-600 flex items-center justify-center">
            <Lightbulb className="h-4 w-4 text-white" />
          </div>
          Smart Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg ${insight.bgColor} border border-transparent hover:border-current/20 transition-all duration-200 group`}
            >
              <div
                className={`p-2 rounded-lg ${insight.bgColor} group-hover:scale-105 transition-transform duration-200`}
              >
                <insight.icon className={`h-4 w-4 ${insight.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm mb-1">{insight.title}</p>
                <p className="text-xs text-muted-foreground">
                  {insight.description}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`text-xs px-2 py-1 rounded-lg border-0 ${
                  insight.type === "warning"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                    : insight.type === "success"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                }`}
              >
                {insight.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSettings } from "@/lib/store";
import { type Budget } from "@/lib/store";
import { Target } from "lucide-react";

interface BudgetProgressProps {
  budget: Budget;
}

export function BudgetProgress({ budget }: BudgetProgressProps) {
  const settings = useSettings();

  const percentage = (budget.spent / budget.amount) * 100;
  const remaining = budget.amount - budget.spent;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600 dark:text-red-400";
    if (percentage >= 75) return "text-orange-600 dark:text-orange-400";
    if (percentage >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-600";
    if (percentage >= 75) return "bg-orange-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-green-600";
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-base">
          <div className="h-8 w-8 rounded-lg bg-yellow-600 flex items-center justify-center">
            <Target className="h-4 w-4 text-white" />
          </div>
          {budget.category}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-muted-foreground">
              Spent:{" "}
              <span className="text-foreground">
                {formatAmount(budget.spent)}
              </span>
            </span>
            <span className="text-muted-foreground">
              Budget:{" "}
              <span className="text-foreground">
                {formatAmount(budget.amount)}
              </span>
            </span>
          </div>
          <div className="relative">
            <Progress value={percentage} className="h-3 bg-muted/50" />
            <div
              className={`absolute inset-0 h-3 rounded-full ${getProgressColor(
                percentage
              )} opacity-20`}
            />
          </div>
          <div className="flex justify-between items-center">
            <span
              className={`text-sm font-semibold ${getStatusColor(percentage)}`}
            >
              {percentage.toFixed(1)}% used
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {formatAmount(remaining)} remaining
            </span>
          </div>
          {percentage >= 90 && (
            <div className="text-xs text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-950/50 px-2 py-1 rounded-lg">
              ⚠️ Budget limit nearly reached
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { useSettings } from "@/lib/store";
import { type Goal } from "@/lib/store";

interface GoalTrackerProps {
  goal: Goal;
}

export function GoalTracker({ goal }: GoalTrackerProps) {
  const settings = useSettings();

  const percentage = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-green-600";
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 50) return "bg-blue-500";
    if (percentage >= 25) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-base">
            <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
              <Target className="h-4 w-4 text-white" />
            </div>
            {goal.name}
          </CardTitle>
          <Button size="sm" variant="outline" className="rounded-lg">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goal.description && (
            <p className="text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg">
              {goal.description}
            </p>
          )}

          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-muted-foreground">
                Current:{" "}
                <span className="text-foreground">
                  {formatAmount(goal.currentAmount)}
                </span>
              </span>
              <span className="text-muted-foreground">
                Target:{" "}
                <span className="text-foreground">
                  {formatAmount(goal.targetAmount)}
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
                className={`text-sm font-semibold ${
                  percentage >= 100
                    ? "text-green-600 dark:text-green-400"
                    : percentage >= 75
                    ? "text-green-600 dark:text-green-400"
                    : percentage >= 50
                    ? "text-blue-600 dark:text-blue-400"
                    : percentage >= 25
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {percentage.toFixed(1)}% complete
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {formatAmount(remaining)} to go
              </span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded-lg inline-block">
            🎯 Deadline: {formatDate(goal.deadline)}
          </div>

          {percentage >= 100 && (
            <div className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-950/50 px-2 py-1 rounded-lg">
              🎉 Goal achieved! Congratulations!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

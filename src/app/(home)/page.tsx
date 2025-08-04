"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetProgress } from "@/components/budget-progress";
import { GoalTracker } from "@/components/goal-tracker";
import { QuickActions } from "@/components/quick-actions";
import { SpendingInsights } from "@/components/spending-insights";
import { RecentActivity } from "@/components/recent-activity";
import { FloatingCalculator } from "@/components/floating-calculator";
import {
  useTransactions,
  useBudgets,
  useGoals,
  useSettings,
  useCurrentMonth,
  useShowAmounts,
  useFinanceActions,
} from "@/lib/store";
import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function Dashboard() {
  const transactions = useTransactions();
  const budgets = useBudgets();
  const goals = useGoals();
  const settings = useSettings();
  const currentMonth = useCurrentMonth();
  const showAmounts = useShowAmounts();

  // Filter transactions for current month
  const currentMonthTransactions = transactions.filter((t) =>
    t.date.startsWith(currentMonth)
  );

  // Calculate totals
  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSavings = totalIncome - totalExpenses;

  // Prepare chart data
  const expensesByCategory = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  const monthlyData = [
    { month: "Oct", income: 145000, expenses: 89000 },
    { month: "Nov", income: 152000, expenses: 95000 },
    { month: "Dec", income: 148000, expenses: 87000 },
    { month: "Jan", income: totalIncome, expenses: totalExpenses },
  ];

  const formatAmount = (amount: number) => {
    if (!showAmounts) return "****";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const COLORS = ["#1877f2", "#42a5f5", "#90caf9", "#bbdefb", "#e3f2fd"];

  return (
    <div>
      {/* Main Content with Bottom Padding and Max Width */}
      <div className="max-w-7xl mx-auto">
        <div className="p-6 space-y-8 pb-32">
          {/* Quick Actions */}
          <QuickActions />

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-300">
                  Total Income
                </CardTitle>
                <div className="h-12 w-12 rounded-xl bg-green-600 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {formatAmount(totalIncome)}
                </div>
                <p className="text-xs text-green-600/70 dark:text-green-400/70 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-300">
                  Total Expenses
                </CardTitle>
                <div className="h-12 w-12 rounded-xl bg-red-600 flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                  {formatAmount(totalExpenses)}
                </div>
                <p className="text-xs text-red-600/70 dark:text-red-400/70 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  -5% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Net Savings
                </CardTitle>
                <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <PiggyBank className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold mb-2 ${
                    totalSavings >= 0
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {formatAmount(totalSavings)}
                </div>
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
                  {totalSavings >= 0
                    ? "Great job saving! 🎉"
                    : "Consider reducing expenses"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Insights and Recent Activity */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <SpendingInsights />
            <RecentActivity />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <Card className="border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  Expenses by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Amount",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[200px] sm:h-[250px] md:h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${((percent || 0) * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="h-3 w-3 rounded-full bg-purple-600"></div>
                  Monthly Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    income: {
                      label: "Income",
                      color: "hsl(var(--chart-1))",
                    },
                    expenses: {
                      label: "Expenses",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[200px] sm:h-[250px] md:h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="income"
                        fill="var(--color-chart-1)"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="expenses"
                        fill="var(--color-chart-2)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Budget Overview */}
          <div>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-yellow-600"></div>
              Budget Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.slice(0, 3).map((budget) => (
                <BudgetProgress key={budget.id} budget={budget} />
              ))}
            </div>
          </div>

          {/* Goals */}
          <div>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-600"></div>
              Savings Goals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.slice(0, 2).map((goal) => (
                <GoalTracker key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Calculator - positioned in bottom right */}
      <div className="fixed bottom-24 right-4 z-40 md:bottom-6">
        <FloatingCalculator />
      </div>
    </div>
  );
}

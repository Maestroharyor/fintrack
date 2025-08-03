"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useSettings, useFinanceActions } from "@/lib/store";
import { type Transaction } from "@/lib/store";
import {
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  Tag,
} from "lucide-react";

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const settings = useSettings();
  const { deleteTransaction, toggleTransactionComplete } = useFinanceActions();

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
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(transaction.id);
    }
  };

  return (
    <Card
      className={`hover:shadow-sm border shadow-sm bg-card transition-all duration-200 ${
        transaction.completed
          ? "opacity-75 bg-muted/30"
          : transaction.type === "income"
          ? "border-l-4 border-l-green-500"
          : "border-l-4 border-l-red-500"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Transaction Type Icon */}
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                transaction.type === "income" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {transaction.type === "income" ? (
                <TrendingUp className="h-5 w-5 text-white" />
              ) : (
                <TrendingDown className="h-5 w-5 text-white" />
              )}
            </div>

            {/* Transaction Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">
                  {transaction.description}
                </h3>
                {transaction.completed && (
                  <Badge variant="secondary" className="text-xs">
                    Completed
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span>{transaction.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(transaction.date)}</span>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="text-right flex-shrink-0">
              <p
                className={`font-bold text-lg ${
                  transaction.type === "income"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatAmount(transaction.amount)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            <Checkbox
              checked={transaction.completed}
              onCheckedChange={() => toggleTransactionComplete(transaction.id)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 text-destructive focus:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

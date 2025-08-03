"use client"
import { MoreHorizontal, Edit, Trash2, Check, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useFinanceStore, type Transaction } from "@/lib/store"
import { cn } from "@/lib/utils"

interface TransactionCardProps {
  transaction: Transaction
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const { deleteTransaction, toggleTransactionComplete, settings } = useFinanceStore()

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md border-l-4",
        transaction.completed
          ? "bg-muted/30 border-l-green-500"
          : transaction.type === "income"
            ? "border-l-green-500"
            : "border-l-red-500",
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={transaction.completed}
            onCheckedChange={() => toggleTransactionComplete(transaction.id)}
            className="mt-1"
          />

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={cn("font-medium", transaction.completed && "line-through text-muted-foreground")}>
                {transaction.description}
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  transaction.type === "income"
                    ? "border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-300 dark:bg-green-950"
                    : "border-red-200 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-300 dark:bg-red-950",
                )}
              >
                {transaction.category}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
            {transaction.tags && transaction.tags.length > 0 && (
              <div className="flex gap-1 mt-2">
                {transaction.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-semibold text-lg",
                transaction.completed && "line-through text-muted-foreground",
                !transaction.completed &&
                  (transaction.type === "income"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"),
              )}
            >
              {transaction.type === "income" ? "+" : "-"}
              {formatAmount(transaction.amount)}
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toggleTransactionComplete(transaction.id)}>
                  {transaction.completed ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Mark Incomplete
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Mark Complete
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => deleteTransaction(transaction.id)} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

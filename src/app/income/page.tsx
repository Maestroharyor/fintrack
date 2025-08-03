"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MonthSelector } from "@/components/month-selector"
import { TransactionCard } from "@/components/transaction-card"
import { TransactionModal } from "@/components/transaction-modal"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFinanceStore } from "@/lib/store"
import { Search, Filter } from "lucide-react"

export default function IncomePage() {
  const { transactions, settings, currentMonth } = useFinanceStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Filter income for current month
  const income = transactions.filter((t) => t.type === "income" && t.date.startsWith(currentMonth))

  // Apply filters
  const filteredIncome = income.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || transaction.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalIncome = filteredIncome.reduce((sum, t) => sum + t.amount, 0)

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Income</h1>
        <MonthSelector />
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Total Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{formatAmount(totalIncome)}</div>
          <p className="text-sm text-muted-foreground mt-1">{filteredIncome.length} transactions</p>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search income..."
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
            {settings.categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Add Transaction Button (Desktop) */}
      <div className="hidden md:block">
        <TransactionModal type="income" />
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredIncome.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No income found for the selected filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredIncome.map((transaction) => <TransactionCard key={transaction.id} transaction={transaction} />)
        )}
      </div>
    </div>
  )
}

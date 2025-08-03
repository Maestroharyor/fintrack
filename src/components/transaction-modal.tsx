"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useFinanceStore } from "@/lib/store"
import { useMediaQuery } from "@/hooks/use-media-query"

interface TransactionModalProps {
  type?: "income" | "expense"
}

export function TransactionModal({ type }: TransactionModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: type || "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  const { addTransaction, settings, currentMonth } = useFinanceStore()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount || !formData.category) return

    addTransaction({
      type: formData.type as "income" | "expense",
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
    })

    setFormData({
      type: type || "expense",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    })
    setOpen(false)
  }

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="income">Income</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount ({settings.currency})</Label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0.00"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {settings.categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Optional description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Add Transaction
      </Button>
    </form>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button className="fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg md:hidden">
            <Plus className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add Transaction</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">{form}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  )
}

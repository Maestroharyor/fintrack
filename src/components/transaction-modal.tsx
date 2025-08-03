"use client";

import type React from "react";

import { useState } from "react";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSettings, useFinanceActions } from "@/lib/store";
import { useMediaQuery } from "@/hooks/use-media-query";

interface TransactionModalProps {
  type?: "income" | "expense";
}

export function TransactionModal({ type }: TransactionModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: type || "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const settings = useSettings();
  const { addTransaction } = useFinanceActions();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;

    addTransaction({
      type: formData.type as "income" | "expense",
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
    });

    setFormData({
      type: type || "expense",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setOpen(false);
  };

  const form = (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-3">
        <Label htmlFor="type" className="text-sm font-semibold">
          Transaction Type
        </Label>
        <Select
          value={formData.type}
          onValueChange={(value: "income" | "expense") =>
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger className="h-12 rounded-lg border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            <SelectItem value="expense" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Expense
            </SelectItem>
            <SelectItem value="income" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Income
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label htmlFor="amount" className="text-sm font-semibold">
          Amount ({settings.currency})
        </Label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0.00"
          required
          className="h-12 rounded-lg border-border text-lg font-semibold"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="category" className="text-sm font-semibold">
          Category
        </Label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData({ ...formData, category: value })
          }
        >
          <SelectTrigger className="h-12 rounded-lg border-border">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            {settings.categories.map((category: string) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label htmlFor="description" className="text-sm font-semibold">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Optional description"
          className="rounded-lg border-border min-h-[80px]"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="date" className="text-sm font-semibold">
          Date
        </Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          className="h-12 rounded-lg border-border"
        />
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
      >
        Add Transaction
      </Button>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button className="fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg md:hidden bg-primary hover:bg-primary/90 border-0 text-primary-foreground">
            <Plus className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="rounded-t-2xl border shadow-lg bg-card">
          <DrawerHeader className="pb-4">
            <DrawerTitle className="flex items-center gap-3 text-lg">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Plus className="h-4 w-4 text-primary-foreground" />
              </div>
              Add Transaction
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">{form}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[400px] rounded-2xl border shadow-lg bg-card">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-lg">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Plus className="h-4 w-4 text-primary-foreground" />
            </div>
            Add Transaction
          </DialogTitle>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  );
}

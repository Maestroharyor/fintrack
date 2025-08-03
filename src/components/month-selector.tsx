"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFinanceStore } from "@/lib/store"

export function MonthSelector() {
  const { currentMonth, setCurrentMonth } = useFinanceStore()

  const formatMonth = (month: string) => {
    const date = new Date(month + "-01")
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const date = new Date(currentMonth + "-01")
    if (direction === "prev") {
      date.setMonth(date.getMonth() - 1)
    } else {
      date.setMonth(date.getMonth() + 1)
    }
    const newMonth = date.toISOString().slice(0, 7)
    setCurrentMonth(newMonth)
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <h2 className="text-lg font-semibold min-w-[140px] text-center">{formatMonth(currentMonth)}</h2>

      <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

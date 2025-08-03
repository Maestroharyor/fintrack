"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calculator } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function FloatingCalculator() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const inputOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return firstValue / secondValue
      case "=":
        return secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const buttons = [
    ["C", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-32 right-4 z-40 h-12 w-12 rounded-full shadow-lg md:bottom-4 bg-transparent"
        >
          <Calculator className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[300px]">
        <DialogHeader>
          <DialogTitle>Calculator</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Display */}
          <div className="bg-muted p-4 rounded-lg text-right">
            <div className="text-2xl font-mono font-bold truncate">{display}</div>
          </div>

          {/* Buttons */}
          <div className="grid gap-2">
            {buttons.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-4 gap-2">
                {row.map((btn) => (
                  <Button
                    key={btn}
                    variant={["C", "±", "%", "÷", "×", "-", "+", "="].includes(btn) ? "secondary" : "outline"}
                    className={`h-12 ${btn === "0" ? "col-span-2" : ""} ${btn === "=" ? "col-span-2 bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                    onClick={() => {
                      if (btn === "C") {
                        clear()
                      } else if (btn === "=") {
                        performCalculation()
                      } else if (["+", "-", "×", "÷"].includes(btn)) {
                        inputOperation(btn)
                      } else if (btn === "±") {
                        setDisplay(String(Number.parseFloat(display) * -1))
                      } else if (btn === "%") {
                        setDisplay(String(Number.parseFloat(display) / 100))
                      } else {
                        inputNumber(btn)
                      }
                    }}
                  >
                    {btn}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

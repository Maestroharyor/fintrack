"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, Maximize2, Minimize2, History, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CalculationHistory {
  expression: string;
  result: string;
  timestamp: Date;
}

export function FloatingCalculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [expression, setExpression] = useState("");

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
    setExpression(expression + display + " " + nextOperation + " ");
  };

  const calculate = (
    firstValue: number,
    secondValue: number,
    operation: string
  ) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      case "=":
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      const finalExpression = expression + display + " = " + newValue;

      // Add to history
      setHistory((prev) => [
        {
          expression: finalExpression,
          result: String(newValue),
          timestamp: new Date(),
        },
        ...prev.slice(0, 9),
      ]); // Keep last 10 calculations

      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
      setExpression("");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setExpression("");
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const useHistoryResult = (result: string) => {
    setDisplay(result);
    setWaitingForOperand(true);
    setShowHistory(false);
  };

  const buttons = [
    ["C", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 border-0 text-primary-foreground"
        >
          <Calculator className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`rounded-2xl border shadow-lg bg-card transition-all duration-300 ${
          isExpanded ? "w-[500px]" : "w-[320px]"
        }`}
      >
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-lg">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Calculator className="h-4 w-4 text-primary-foreground" />
              </div>
              Calculator
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowHistory(!showHistory)}
                className="h-8 w-8 rounded-lg"
              >
                <History className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 rounded-lg"
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Expression Display */}
          {expression && (
            <div className="bg-muted/30 p-2 rounded-lg text-sm text-muted-foreground font-mono">
              {expression}
            </div>
          )}

          {/* Display */}
          <div className="bg-muted/50 p-4 rounded-xl text-right border border-border">
            <div className="text-3xl font-mono font-bold truncate text-foreground">
              {display}
            </div>
          </div>

          {/* History Panel */}
          {showHistory && (
            <div className="bg-muted/30 rounded-xl p-3 max-h-40">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold">History</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <ScrollArea className="h-32">
                {history.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No calculations yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {history.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-background/50 hover:bg-background/70 cursor-pointer transition-colors"
                        onClick={() => useHistoryResult(item.result)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground truncate">
                            {item.expression}
                          </p>
                          <p className="text-sm font-semibold">{item.result}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {item.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          )}

          {/* Buttons */}
          <div className="grid gap-3">
            {buttons.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-4 gap-3">
                {row.map((btn) => (
                  <Button
                    key={btn}
                    variant="outline"
                    className={`h-12 rounded-xl font-semibold transition-all duration-200 ${
                      btn === "0" ? "col-span-2" : ""
                    } ${
                      btn === "="
                        ? "col-span-2 bg-primary hover:bg-primary/90 text-primary-foreground border-0"
                        : ["÷", "×", "-", "+"].includes(btn)
                        ? "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                        : ["C", "±", "%"].includes(btn)
                        ? "bg-muted/50 hover:bg-muted border-muted-foreground/20 text-muted-foreground"
                        : "bg-background hover:bg-muted border-border"
                    }`}
                    onClick={() => {
                      if (btn === "C") {
                        clear();
                      } else if (btn === "=") {
                        performCalculation();
                      } else if (["+", "-", "×", "÷"].includes(btn)) {
                        inputOperation(btn);
                      } else if (btn === "±") {
                        setDisplay(String(Number.parseFloat(display) * -1));
                      } else if (btn === "%") {
                        setDisplay(String(Number.parseFloat(display) / 100));
                      } else {
                        inputNumber(btn);
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
  );
}

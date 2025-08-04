"use client";

import { Button } from "@/components/ui/button";
import { SearchCommand } from "@/components/search-command";
import { MonthSelector } from "@/components/month-selector";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useShowAmounts, useFinanceActions } from "@/lib/store";

export function HomeHeader() {
  const showAmounts = useShowAmounts();
  const { toggleShowAmounts } = useFinanceActions();

  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border w-full">
      <div className="px-3 sm:px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-3xl font-bold text-foreground">Fintrack</h1>
              <p className="text-sm text-muted-foreground hidden md:block">
                Your financial companion
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <SearchCommand />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleShowAmounts}
              className="h-10 w-10"
            >
              {showAmounts ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
            <MonthSelector />
          </div>
        </div>
      </div>
    </div>
  );
}

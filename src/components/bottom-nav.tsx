"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  TrendingDown,
  TrendingUp,
  PieChart,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/expenses", icon: TrendingDown, label: "Expenses" },
  { href: "/income", icon: TrendingUp, label: "Income" },
  { href: "/budget", icon: PieChart, label: "Budget" },
  { href: "/more", icon: MoreHorizontal, label: "More" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-soft border-t border-blue-100 dark:border-slate-700 md:hidden">
      <div className="flex items-center justify-around py-3 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-all duration-300 rounded-xl relative group",
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-primary/10 rounded-xl" />
              )}
              <div
                className={cn(
                  "relative z-10 transition-all duration-300",
                  isActive && "scale-110"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isActive && "drop-shadow-sm"
                  )}
                />
              </div>
              <span className="relative z-10 font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

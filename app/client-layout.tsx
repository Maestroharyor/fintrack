"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DesktopNav } from "@/components/desktop-nav"
import { BottomNav } from "@/components/bottom-nav"
import { TransactionModal } from "@/components/transaction-modal"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith("/auth")

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {isAuthPage ? (
            children
          ) : (
            <SidebarProvider>
              <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                <DesktopNav />
                <main className="flex-1 pb-16 md:pb-0">{children}</main>
              </div>
              <BottomNav />
              <TransactionModal />
            </SidebarProvider>
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}

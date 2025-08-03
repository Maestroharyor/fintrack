"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"

interface MobileHeaderProps {
  title: string
  showBackButton?: boolean
}

export function MobileHeader({ title, showBackButton = true }: MobileHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Don't show back button on main pages
  const mainPages = ["/", "/expenses", "/income", "/budget", "/more"]
  const shouldShowBack = showBackButton && !mainPages.includes(pathname)

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b md:hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        {shouldShowBack && (
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 -ml-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-semibold flex-1">{title}</h1>
      </div>
    </div>
  )
}

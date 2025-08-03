"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  TrendingDown,
  TrendingUp,
  PieChart,
  Target,
  Repeat,
  Settings,
  Bell,
  LogOut,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { SearchCommand } from "@/components/search-command";

const mainNavItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/expenses", icon: TrendingDown, label: "Expenses" },
  { href: "/income", icon: TrendingUp, label: "Income" },
  { href: "/budget", icon: PieChart, label: "Budget" },
];

const otherNavItems = [
  { href: "/goals", icon: Target, label: "Goals" },
  { href: "/recurring", icon: Repeat, label: "Recurring" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function DesktopNav() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="hidden md:flex">
      <SidebarHeader>
        <div className={`px-2 py-8 ${isCollapsed ? "px-4" : ""}`}>
          <div
            className={`flex items-center gap-3 mb-6 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-sidebar-foreground truncate">
                  Fintrack
                </h2>
                <p className="text-sm text-muted-foreground truncate">
                  Personal Finance
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="flex justify-center">
              <SearchCommand />
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className={`px-3 ${isCollapsed ? "px-2" : ""}`}>
        <SidebarGroup className="p-0">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Main
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={`h-11 rounded-lg ${
                      pathname === item.href
                        ? "bg-blue-600 text-white shadow-none"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 ${
                        isCollapsed ? "justify-center" : ""
                      }`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium truncate">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mt-4 " />

        <SidebarGroup className="mt-6 p-0">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Tools
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {otherNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={`h-11 rounded-lg ${
                      pathname === item.href
                        ? "bg-blue-600 text-white shadow-none"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 ${
                        isCollapsed ? "justify-center" : ""
                      }`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium truncate">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={`px-3 pb-6 ${isCollapsed ? "px-2" : ""}`}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-11 rounded-lg hover:bg-destructive/10 hover:text-destructive"
            >
              <Link
                href="/auth/signin"
                className={`flex items-center gap-3 px-3 ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium truncate">Sign Out</span>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Collapse Toggle Button - Inside Sidebar */}
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
            className={`w-full h-9 rounded-lg border-border hover:bg-muted ${
              isCollapsed ? "px-2" : ""
            }`}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="text-sm">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

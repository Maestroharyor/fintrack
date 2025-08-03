"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Target,
  Repeat,
  Settings,
  Bell,
  HelpCircle,
  Shield,
  Download,
  LogOut,
} from "lucide-react";

export default function MorePage() {
  const menuItems = [
    {
      title: "Savings Goals",
      description: "Track and manage your savings goals",
      icon: Target,
      href: "/goals",
      color: "text-blue-600",
    },
    {
      title: "Recurring Transactions",
      description: "Set up automatic income and expenses",
      icon: Repeat,
      href: "/recurring",
      color: "text-green-600",
    },
    {
      title: "Notifications",
      description: "Manage your notification preferences",
      icon: Bell,
      href: "/notifications",
      color: "text-orange-600",
    },
    {
      title: "Settings",
      description: "Customize your app preferences",
      icon: Settings,
      href: "/settings",
      color: "text-gray-600",
    },
  ];

  const supportItems = [
    {
      title: "Help & Support",
      description: "Get help and find answers",
      icon: HelpCircle,
      href: "#",
    },
    {
      title: "Privacy Policy",
      description: "Learn about data privacy",
      icon: Shield,
      href: "#",
    },
    {
      title: "Export Data",
      description: "Download your financial data",
      icon: Download,
      href: "#",
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">More</h1>
      </div>

      {/* Main Menu Items */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Tools</h2>
        <div className="grid grid-cols-1 gap-4">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-muted ${item.color}`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Support Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Support</h2>
        <div className="grid grid-cols-1 gap-4">
          {supportItems.map((item) => (
            <Card
              key={item.title}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-muted text-gray-600">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Account Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Account</h2>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  JD
                </div>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-muted-foreground">
                    john.doe@example.com
                  </p>
                </div>
              </div>

              <Link href="/auth/signin">
                <Button variant="outline" className="w-full bg-transparent">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* App Info */}
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Personal Finance Planner v1.0.0
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Built with Next.js and Tailwind CSS
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

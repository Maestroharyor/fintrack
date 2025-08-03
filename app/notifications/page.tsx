"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useFinanceStore } from "@/lib/store"
import { Bell, Clock, Target, TrendingDown } from "lucide-react"
import { MobileHeader } from "@/components/mobile-header"

export default function NotificationsPage() {
  const { settings, updateSettings } = useFinanceStore()

  const handleNotificationChange = (type: keyof typeof settings.notifications, value: boolean) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [type]: value,
      },
    })
  }

  // Mock notification data
  const recentNotifications = [
    {
      id: "1",
      type: "budget",
      title: "Budget Alert",
      message: "You have spent 80% of your Food budget this month",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      type: "goal",
      title: "Goal Progress",
      message: "You are 37% towards your Emergency Fund goal",
      time: "1 day ago",
      read: true,
    },
    {
      id: "3",
      type: "bill",
      title: "Bill Reminder",
      message: "Electricity bill due in 3 days",
      time: "2 days ago",
      read: true,
    },
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "budget":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "goal":
        return <Target className="h-4 w-4 text-blue-500" />
      case "bill":
        return <Clock className="h-4 w-4 text-orange-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <MobileHeader title="Notifications" />

      <div className="p-4 space-y-6">
        <div className="hidden md:flex items-center justify-between">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Button variant="outline" size="sm">
            Mark All as Read
          </Button>
        </div>

        <div className="flex md:hidden justify-end">
          <Button variant="outline" size="sm">
            Mark All as Read
          </Button>
        </div>

        {/* Notification Settings */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <Label htmlFor="summaries">Monthly Summaries</Label>
                <p className="text-sm text-muted-foreground">Receive monthly spending summaries and insights</p>
              </div>
              <Switch
                id="summaries"
                checked={settings.notifications.summaries}
                onCheckedChange={(checked) => handleNotificationChange("summaries", checked)}
                className="shrink-0"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <Label htmlFor="billReminders">Bill Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminded about upcoming bills and due dates</p>
              </div>
              <Switch
                id="billReminders"
                checked={settings.notifications.billReminders}
                onCheckedChange={(checked) => handleNotificationChange("billReminders", checked)}
                className="shrink-0"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <Label htmlFor="goalReminders">Goal Progress</Label>
                <p className="text-sm text-muted-foreground">Track progress on your savings goals and milestones</p>
              </div>
              <Switch
                id="goalReminders"
                checked={settings.notifications.goalReminders}
                onCheckedChange={(checked) => handleNotificationChange("goalReminders", checked)}
                className="shrink-0"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <Label htmlFor="budgetAlerts">Budget Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when you approach budget limits</p>
              </div>
              <Switch id="budgetAlerts" checked={true} onCheckedChange={() => {}} className="shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border w-full ${!notification.read ? "bg-muted/50" : ""}`}
                >
                  <div className="mt-1 shrink-0">{getNotificationIcon(notification.type)}</div>

                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      {!notification.read && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Delivery Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
              </div>
              <Switch defaultChecked className="shrink-0" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch className="shrink-0" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <Label>Weekly Digest</Label>
                <p className="text-sm text-muted-foreground">Get a weekly summary of your financial activity</p>
              </div>
              <Switch defaultChecked className="shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

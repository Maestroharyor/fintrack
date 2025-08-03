"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useFinanceStore } from "@/lib/store"
import { useTheme } from "next-themes"
import { Moon, Sun, Plus, X } from "lucide-react"
import { MobileHeader } from "@/components/mobile-header"

export default function SettingsPage() {
  const { settings, updateSettings } = useFinanceStore()
  const { theme, setTheme } = useTheme()
  const [newCategory, setNewCategory] = useState("")
  const [newTag, setNewTag] = useState("")

  const handleCurrencyChange = (currency: string) => {
    updateSettings({ currency })
  }

  const handleNotificationChange = (type: keyof typeof settings.notifications, value: boolean) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [type]: value,
      },
    })
  }

  const addCategory = () => {
    if (newCategory && !settings.categories.includes(newCategory)) {
      updateSettings({
        categories: [...settings.categories, newCategory],
      })
      setNewCategory("")
    }
  }

  const removeCategory = (category: string) => {
    updateSettings({
      categories: settings.categories.filter((c) => c !== category),
    })
  }

  const addTag = () => {
    if (newTag && !settings.tags.includes(newTag)) {
      updateSettings({
        tags: [...settings.tags, newTag],
      })
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    updateSettings({
      tags: settings.tags.filter((t) => t !== tag),
    })
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <MobileHeader title="Settings" />

      <div className="p-4 space-y-6">
        <div className="hidden md:flex items-center justify-between">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        {/* Theme Settings */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Theme</Label>
              <div className="flex items-center gap-2">
                <Button variant={theme === "light" ? "default" : "outline-solid"} size="sm" onClick={() => setTheme("light")}>
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </Button>
                <Button variant={theme === "dark" ? "default" : "outline-solid"} size="sm" onClick={() => setTheme("dark")}>
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline-solid"}
                  size="sm"
                  onClick={() => setTheme("system")}
                >
                  System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currency Settings */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Currency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="currency">Default Currency</Label>
              <Select value={settings.currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">NGN (₦)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Categories Management */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCategory()}
                className="flex-1"
              />
              <Button onClick={addCategory} className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {settings.categories.map((category) => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeCategory(category)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tags Management */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add new tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTag()}
                className="flex-1"
              />
              <Button onClick={addTag} className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {settings.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications Settings */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="summaries">Monthly Summaries</Label>
                <p className="text-sm text-muted-foreground">Receive monthly spending summaries</p>
              </div>
              <Switch
                id="summaries"
                checked={settings.notifications.summaries}
                onCheckedChange={(checked) => handleNotificationChange("summaries", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="billReminders">Bill Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminded about upcoming bills</p>
              </div>
              <Switch
                id="billReminders"
                checked={settings.notifications.billReminders}
                onCheckedChange={(checked) => handleNotificationChange("billReminders", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="goalReminders">Goal Reminders</Label>
                <p className="text-sm text-muted-foreground">Track progress on savings goals</p>
              </div>
              <Switch
                id="goalReminders"
                checked={settings.notifications.goalReminders}
                onCheckedChange={(checked) => handleNotificationChange("goalReminders", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full bg-transparent">
              Copy Previous Month's Expenses
            </Button>

            <Button variant="outline" className="w-full bg-transparent">
              Export Data
            </Button>

            <Button variant="destructive" className="w-full">
              Clear All Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

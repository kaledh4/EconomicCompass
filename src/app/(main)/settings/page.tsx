'use client';

import { Paintbrush, Languages, Sparkles } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/hooks/use-settings';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SettingsPage() {
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    animationsEnabled,
    setAnimationsEnabled,
  } = useSettings();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Settings</CardTitle>
          <CardDescription>
            Manage your application and display settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="theme" className="flex items-center gap-2 text-base">
                <Paintbrush className="h-4 w-4" /> Theme
              </Label>
              <p className="text-sm text-muted-foreground">
                Select a light or dark theme for the interface.
              </p>
            </div>
            <Select
              value={theme}
              onValueChange={(value) => setTheme(value as 'light' | 'dark')}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="language" className="flex items-center gap-2 text-base">
                <Languages className="h-4 w-4" /> Language
              </Label>
              <p className="text-sm text-muted-foreground">
                Choose your preferred language (affects layout).
              </p>
            </div>
            <Select
              value={language}
              onValueChange={(value) => setLanguage(value as 'en' | 'ar')}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>Moment
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label
                htmlFor="animations"
                className="flex items-center gap-2 text-base"
              >
                <Sparkles className="h-4 w-4" /> Animations
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable subtle UI animations.
              </p>
            </div>
            <Switch
              id="animations"
              checked={animationsEnabled}
              onCheckedChange={setAnimationsEnabled}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

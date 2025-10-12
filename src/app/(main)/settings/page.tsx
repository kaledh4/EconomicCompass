'use client';

import { Paintbrush, Sparkles, Languages } from 'lucide-react';
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
import { useI18n } from '@/contexts/i18n-context';

export default function SettingsPage() {
  const { t } = useI18n();
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
          <CardTitle className="font-headline">{t('Settings.title')}</CardTitle>
          <CardDescription>
            {t('Settings.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="theme" className="flex items-center gap-2 text-base">
                <Paintbrush className="h-4 w-4" /> {t('Settings.themeLabel')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('Settings.themeDescription')}
              </p>
            </div>
            <Select
              value={theme}
              onValueChange={(value) => setTheme(value as 'light' | 'dark')}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t('Settings.selectTheme')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t('Settings.lightTheme')}</SelectItem>
                <SelectItem value="dark">{t('Settings.darkTheme')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="language" className="flex items-center gap-2 text-base">
                <Languages className="h-4 w-4" /> {t('Settings.languageLabel')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('Settings.languageDescription')}
              </p>
            </div>
            <Select
              value={language}
              onValueChange={(value) => setLanguage(value as 'en' | 'ar')}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t('Settings.selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('Settings.english')}</SelectItem>
                <SelectItem value="ar">{t('Settings.arabic')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label
                htmlFor="animations"
                className="flex items-center gap-2 text-base"
              >
                <Sparkles className="h-4 w-4" /> {t('Settings.animationsLabel')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('Settings.animationsDescription')}
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

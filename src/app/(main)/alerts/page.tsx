'use client';

import { useActionState, useFormStatus } from 'react';
import { Bell, Bot, Loader } from 'lucide-react';

import { getEconomicAlerts } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useI18n } from '@/contexts/i18n-context';

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useI18n();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" /> {t('Alerts.generating')}
        </>
      ) : (
        t('Alerts.generateButton')
      )}
    </Button>
  );
}

export default function AlertsPage() {
  const initialState = { alerts: [], error: undefined };
  const [state, formAction] = useActionState(getEconomicAlerts, initialState);
  const { t } = useI18n();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{t('Alerts.cardTitle')}</CardTitle>
          <CardDescription>
            {t('Alerts.cardDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <Textarea
              name="currentEvents"
              placeholder={t('Alerts.textareaPlaceholder')}
              className="min-h-[150px]"
              required
            />
            {state.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Bot /> {t('Alerts.generatedTitle')}
          </CardTitle>
          <CardDescription>
            {t('Alerts.generatedDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.alerts.length > 0 ? (
            state.alerts.map((alert, index) => (
              <Alert key={index}>
                <Bell className="h-4 w-4" />
                <AlertTitle>{t('Alerts.alertLabel')}</AlertTitle>
                <AlertDescription>{alert}</AlertDescription>
              </Alert>
            ))
          ) : (
            <div className="flex h-full min-h-[150px] items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                {t('Alerts.noAlerts')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

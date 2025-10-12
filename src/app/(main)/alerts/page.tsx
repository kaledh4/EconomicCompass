'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Bell, Bot, Loader } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { getEconomicAlerts } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations('Alerts');
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" /> {t('generating')}
        </>
      ) : (
        t('generateButton')
      )}
    </Button>
  );
}

export default function AlertsPage() {
  const initialState = { alerts: [], error: undefined };
  const [state, formAction] = useActionState(getEconomicAlerts, initialState);
  const t = useTranslations('Alerts');

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle asChild><h2 className="font-headline">{t('cardTitle')}</h2></CardTitle>
          <CardDescription asChild>
            <p>{t('cardDescription')}</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <Textarea
              name="currentEvents"
              placeholder={t('textareaPlaceholder')}
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
          <CardTitle asChild>
            <h2 className="font-headline flex items-center gap-2">
              <Bot /> {t('generatedTitle')}
            </h2>
          </CardTitle>
          <CardDescription asChild>
            <p>{t('generatedDescription')}</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.alerts.length > 0 ? (
            state.alerts.map((alert, index) => (
              <Alert key={index}>
                <Bell className="h-4 w-4" />
                <AlertTitle>{t('alertLabel')}</AlertTitle>
                <AlertDescription>{alert}</AlertDescription>
              </Alert>
            ))
          ) : (
            <div className="flex h-full min-h-[150px] items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                {t('noAlerts')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

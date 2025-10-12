'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Bell, Bot, Loader } from 'lucide-react';

import { getEconomicAlerts } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" /> Generating...
        </>
      ) : (
        'Generate Alerts'
      )}
    </Button>
  );
}

export default function AlertsPage() {
  const initialState = { alerts: [], error: undefined };
  const [state, formAction] = useActionState(getEconomicAlerts, initialState);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Economic Alerts Feed</CardTitle>
          <CardDescription>
            Input a summary of recent economic news to generate relevant policy
            and market alerts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <Textarea
              name="currentEvents"
              placeholder="e.g., 'The Fed announced a 25 basis point rate hike. CPI data for last month came in higher than expected at 3.5%...'"
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
            <Bot /> Generated Alerts
          </CardTitle>
          <CardDescription>
            AI-powered notifications based on your input.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.alerts.length > 0 ? (
            state.alerts.map((alert, index) => (
              <Alert key={index}>
                <Bell className="h-4 w-4" />
                <AlertTitle>Alert</AlertTitle>
                <AlertDescription>{alert}</AlertDescription>
              </Alert>
            ))
          ) : (
            <div className="flex h-full min-h-[150px] items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                Alerts will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

'use server';

import {
  getEconomicAlerts as getEconomicAlertsFromAI,
  type EconomicAlertsInput,
  type EconomicAlertsOutput,
} from '@/ai/flows/economic-alerts-feed';
import { z } from 'zod';

const inputSchema = z.object({
  currentEvents: z.string().min(10, 'Please provide more details about current events.'),
});


export async function getEconomicAlerts(
  prevState: any,
  formData: FormData
): Promise<{ alerts: string[]; error?: string; }> {
  const validatedFields = inputSchema.safeParse({
    currentEvents: formData.get('currentEvents'),
  });

  if (!validatedFields.success) {
    return {
      alerts: [],
      error: validatedFields.error.flatten().fieldErrors.currentEvents?.[0],
    };
  }

  try {
    const result: EconomicAlertsOutput = await getEconomicAlertsFromAI(
      validatedFields.data
    );
    return { alerts: result.alerts };
  } catch (e) {
    console.error(e);
    return { alerts: [], error: 'Failed to generate alerts. Please try again.' };
  }
}

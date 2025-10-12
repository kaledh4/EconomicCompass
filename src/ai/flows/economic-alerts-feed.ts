'use server';

/**
 * @fileOverview Provides notifications for policy shifts like rate decisions and CPI releases, using a GenAI tool.
 *
 * - getEconomicAlerts - A function that fetches economic alerts based on current events.
 * - EconomicAlertsInput - The input type for the getEconomicAlerts function.
 * - EconomicAlertsOutput - The return type for the getEconomicAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EconomicAlertsInputSchema = z.object({
  currentEvents: z
    .string()
    .describe(
      'A summary of recent economic events and news, to identify potential policy shifts.'
    ),
});
export type EconomicAlertsInput = z.infer<typeof EconomicAlertsInputSchema>;

const EconomicAlertsOutputSchema = z.object({
  alerts: z
    .array(z.string())
    .describe('A list of economic alerts based on the provided events.'),
});
export type EconomicAlertsOutput = z.infer<typeof EconomicAlertsOutputSchema>;

export async function getEconomicAlerts(input: EconomicAlertsInput): Promise<EconomicAlertsOutput> {
  return economicAlertsFlow(input);
}

const economicAlertsPrompt = ai.definePrompt({
  name: 'economicAlertsPrompt',
  input: {schema: EconomicAlertsInputSchema},
  output: {schema: EconomicAlertsOutputSchema},
  prompt: `You are an economic policy expert.  Based on the recent events provided, generate a list of economic alerts that a user should be aware of.

Recent Events:
{{{currentEvents}}}

Alerts:`, // Make sure the prompt is on one line; newlines are not allowed.
});

const economicAlertsFlow = ai.defineFlow(
  {
    name: 'economicAlertsFlow',
    inputSchema: EconomicAlertsInputSchema,
    outputSchema: EconomicAlertsOutputSchema,
  },
  async input => {
    const {output} = await economicAlertsPrompt(input);
    return output!;
  }
);

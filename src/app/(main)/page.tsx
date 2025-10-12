'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { macroMetrics, interestRateHistory, sp500VsBtcCorrelation, fedDotPlotData } from '@/lib/data';
import { Bar, BarChart, CartesianGrid, Line, LineChart, Scatter, ScatterChart, XAxis, YAxis, Label } from 'recharts';

const chartConfig = {
  fedRate: {
    label: 'Fed Rate',
    color: 'hsl(var(--chart-1))',
  },
  btcReturn: {
    label: 'BTC Return %',
    color: 'hsl(var(--chart-1))',
  },
  cpiRate: {
    label: 'CPI Rate %',
    color: 'hsl(var(--chart-2))',
  },
  correlation: {
    label: 'Correlation',
    color: 'hsl(var(--chart-1))',
  },
  dot: {
    label: 'Projection',
    color: 'hsl(var(--chart-1))',
  }
};

const formatDate = (value: string) => {
  const date = new Date(value);
  // show month and year 'Jan 23'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  });
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {macroMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="pb-2">
              <CardDescription>{metric.title}</CardDescription>
              <CardTitle asChild>
                <h3 className="text-4xl font-bold">{metric.value}</h3>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  'text-xs',
                  metric.changeType === 'positive'
                    ? 'text-green-500'
                    : 'text-red-500'
                )}
              >
                {metric.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle asChild>
              <h3 className="font-headline">S&amp;P 500 vs. BTC Correlation (90-Day)</h3>
            </CardTitle>
            <CardDescription asChild>
              <p>
                Measures how closely Bitcoin's price movement tracks the S&amp;P 500 index.
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart data={sp500VsBtcCorrelation} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatDate} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[-1, 1]}/>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey="correlation"
                  type="monotone"
                  stroke="var(--color-correlation)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle asChild>
              <h3 className="font-headline">Interest Rate History</h3>
            </CardTitle>
            <CardDescription asChild>
              <p>
                Federal funds effective rate over the last 24 months.
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart data={interestRateHistory} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatDate} />
                <YAxis unit="%" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey="Fed Rate"
                  type="monotone"
                  stroke="var(--color-fedRate)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle asChild>
              <h3 className="font-headline">Fed Dot Plot (FOMC Projections)</h3>
            </CardTitle>
            <CardDescription asChild>
              <p>
                Each dot represents a Fed member's projection for the federal funds rate.
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <ScatterChart margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="year" type="category" allowDuplicatedCategory={false} tickLine={false} axisLine={false} tickMargin={8}/>
                    <YAxis dataKey="rate" unit="%" tickLine={false} axisLine={false} tickMargin={8}/>
                    <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                    <Scatter name="Projection" data={fedDotPlotData} fill="var(--color-dot)" />
                </ScatterChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

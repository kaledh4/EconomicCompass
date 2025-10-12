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
import { macroMetrics, interestRateHistory, inflationVsBTC, sp500VsBtcCorrelation } from '@/lib/data';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

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
  }
};

const formatDate = (value: string) => {
  const date = new Date(value);
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
                {metric.change} vs last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
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

      </div>
       <Card>
          <CardHeader>
            <CardTitle asChild>
              <h3 className="font-headline">CPI vs. BTC Returns</h3>
            </CardTitle>
            <CardDescription asChild>
              <p>
                Monthly Bitcoin returns against year-over-year inflation.
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart data={inflationVsBTC} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatDate} />
                    <YAxis yAxisId="left" orientation="left" stroke="var(--color-cpiRate)" tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--color-btcReturn)" tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar yAxisId="left" dataKey="CPI Rate" fill="var(--color-cpiRate)" radius={4} />
                    <Bar yAxisId="right" dataKey="BTC Return" fill="var(--color-btcReturn)" radius={4} />
                </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
    </div>
  );
}

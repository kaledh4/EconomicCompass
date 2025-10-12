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
import { macroMetrics, interestRateHistory, inflationVsBTC } from '@/lib/data';
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
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {macroMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="pb-2">
              <CardDescription>{metric.title}</CardDescription>
              <CardTitle className="text-4xl font-bold">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  'text-xs',
                  metric.changeType === 'positive'
                    ? 'text-accent'
                    : 'text-destructive'
                )}
              >
                {metric.change} vs last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interest Rate History</CardTitle>
            <CardDescription>
              Federal funds effective rate over the last 24 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart data={interestRateHistory} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
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

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">CPI vs. BTC Returns</CardTitle>
            <CardDescription>
              Monthly Bitcoin returns against year-over-year inflation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart data={inflationVsBTC} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
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
    </div>
  );
}

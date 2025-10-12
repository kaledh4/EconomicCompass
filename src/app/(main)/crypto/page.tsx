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
import { cryptoMetrics, btcLogRegression } from '@/lib/data';
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

const chartConfig = {
  price: {
    label: 'Price',
    color: 'hsl(var(--primary))',
  },
  topBand: {
    label: 'Top Band',
    color: 'hsl(var(--destructive))',
  },
  bottomBand: {
    label: 'Bottom Band',
    color: 'hsl(var(--accent))',
  },
};

export default function CryptoPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cryptoMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="pb-2">
              <CardDescription>{metric.description}</CardDescription>
              <CardTitle className="text-4xl font-bold">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  'text-xs',
                  metric.changeType === 'positive'
                    ? 'text-accent'
                    // TODO: Use a color variable for negative change
                    : 'text-destructive'
                )}
              >
                {metric.change} in last 24h
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Bitcoin Logarithmic Regression</CardTitle>
          <CardDescription>
            Visualizing Bitcoin's long-term price cycles and potential tops and
            bottoms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <LineChart
              data={btcLogRegression}
              margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => new Date(value).getFullYear().toString()}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                type="number"
                domain={['dataMin', 'dataMax']}
                scale="log"
              />
              <ChartTooltip
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                dataKey="Price"
                type="monotone"
                stroke="var(--color-price)"
                strokeWidth={2}
                dot={false}
                name="Price"
              />
               <Line
                dataKey="Top Band"
                type="monotone"
                stroke="var(--color-topBand)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Top Band"
              />
               <Line
                dataKey="Bottom Band"
                type="monotone"
                stroke="var(--color-bottomBand)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Bottom Band"
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

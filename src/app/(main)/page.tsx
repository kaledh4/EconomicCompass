
'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  getMacroMetrics,
  interestRateHistory,
  sp500VsBtcCorrelation,
  fedDotPlotData,
} from '@/lib/data';
import type { MetricCardData } from '@/lib/types';
import {
  Line,
  LineChart,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useI18n } from '@/contexts/i18n-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MetricCard } from '@/components/metric-card';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


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
  },
};

const formatDate = (value: string) => {
  const date = new Date(value);
  // show month and year 'Jan 23'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  });
};

function MetricCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-2/4" />
        <Skeleton className="h-8 w-1/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-2/3 mt-1" />
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { t } = useI18n();
  const [metrics, setMetrics] = useState<MetricCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      setLoading(true);
      const macroMetrics = await getMacroMetrics(t);
      setMetrics(macroMetrics);
      setLoading(false);
    }
    loadMetrics();
  }, [t]);


  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
        ) : (
          metrics.map((metric) => (
            <MetricCard key={metric.title} metric={metric} />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle asChild>
              <h3 className="font-headline">{t('Macro.correlationTitle')}</h3>
            </CardTitle>
            <CardDescription asChild>
              <p>{t('Macro.correlationDescription')}</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart
                data={sp500VsBtcCorrelation}
                margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatDate}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={[-1, 1]}
                />
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
              <h3 className="font-headline">{t('Macro.interestRateTitle')}</h3>
            </CardTitle>
            <CardDescription asChild>
              <p>{t('Macro.interestRateDescription')}</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart
                data={interestRateHistory}
                margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatDate}
                />
                <YAxis
                  unit="%"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
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
              <h3 className="font-headline">{t('Macro.dotPlotTitle')}</h3>
            </CardTitle>
            <CardDescription asChild>
              <p>{t('Macro.dotPlotDescription')}</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ScatterChart
                margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  type="category"
                  allowDuplicatedCategory={false}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  dataKey="rate"
                  unit="%"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={<ChartTooltipContent />}
                />
                <Scatter
                  name="Projection"
                  data={fedDotPlotData}
                  fill="var(--color-dot)"
                />
              </ScatterChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

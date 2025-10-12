'use client';

import { useState, useEffect } from 'react';
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
import { cryptoMetrics, btcLogRegression, getNextHalving } from '@/lib/data';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useI18n } from '@/contexts/i18n-context';

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

function HalvingCountdown() {
  const { t } = useI18n();
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const { nextHalvingDate } = getNextHalving();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const distance = nextHalvingDate.getTime() - now.getTime();

      if (distance < 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [nextHalvingDate]);

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      <div>
        <div className="text-2xl font-bold">
          {String(countdown.days).padStart(2, '0')}
        </div>
        <div className="text-xs text-muted-foreground">{t('Crypto.days')}</div>
      </div>
      <div>
        <div className="text-2xl font-bold">
          {String(countdown.hours).padStart(2, '0')}
        </div>
        <div className="text-xs text-muted-foreground">{t('Crypto.hours')}</div>
      </div>
      <div>
        <div className="text-2xl font-bold">
          {String(countdown.minutes).padStart(2, '0')}
        </div>
        <div className="text-xs text-muted-foreground">{t('Crypto.mins')}</div>
      </div>
      <div>
        <div className="text-2xl font-bold">
          {String(countdown.seconds).padStart(2, '0')}
        </div>
        <div className="text-xs text-muted-foreground">{t('Crypto.secs')}</div>
      </div>
    </div>
  );
}

export default function CryptoPage() {
  const { t } = useI18n();
  const metrics = cryptoMetrics(t);
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="pb-2">
              <CardDescription>{metric.description}</CardDescription>
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

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle asChild>
              <h3 className="font-headline">{t('Crypto.logRegTitle')}</h3>
            </CardTitle>
            <CardDescription asChild>
              <p>{t('Crypto.logRegDescription')}</p>
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
                  tickFormatter={(value) =>
                    new Date(value).getFullYear().toString()
                  }
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) =>
                    `$${Number(value).toLocaleString()}`
                  }
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
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle asChild>
                <h3 className="font-headline">{t('Crypto.halvingTitle')}</h3>
              </CardTitle>
              <CardDescription>
                {t('Crypto.halvingDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HalvingCountdown />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

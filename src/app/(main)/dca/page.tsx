
'use client';

import { useState } from 'react';
import { DollarSign, Bitcoin, Calendar, Calculator } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { availableAssets as getAvailableAssets, dcaSimulationResult } from '@/lib/data';
import type { ChartDataPoint } from '@/lib/types';
import { useI18n } from '@/contexts/i18n-context';

const chartConfig = {
  portfolioValue: {
    label: 'Portfolio Value',
    color: 'hsl(var(--chart-1))',
  },
  totalInvested: {
    label: 'Total Invested',
    color: 'hsl(var(--muted-foreground))',
  },
};

type SimulationResult = {
  data: ChartDataPoint[];
  finalValue: string;
  totalInvested: string;
  roi: string;
};

export default function DcaSimulatorPage() {
  const { t } = useI18n();
  const [investment, setInvestment] = useState('100');
  const [asset, setAsset] = useState('BTC-USD');
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleSimulate = () => {
    const amount = parseFloat(investment);
    if (!isNaN(amount) && amount > 0) {
      setResult(dcaSimulationResult(amount));
    }
  };
  
  const currentYear = new Date().getFullYear();
  const availableAssets = getAvailableAssets(t);


  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">{t('DCA.title')}</CardTitle>
            <CardDescription>
              {t('DCA.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="asset">{t('DCA.assetLabel')}</Label>
              <Select value={asset} onValueChange={setAsset}>
                <SelectTrigger id="asset" aria-label={t('DCA.selectAsset')}>
                  <SelectValue placeholder={t('DCA.selectAsset')} />
                </SelectTrigger>
                <SelectContent>
                  {availableAssets.map((a) => (
                    <SelectItem key={a.ticker} value={a.ticker}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="investment">{t('DCA.investmentLabel')}</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-2.5" />
                <Input
                  id="investment"
                  type="number"
                  placeholder="100"
                  className="pl-8 rtl:pl-2 rtl:pr-8"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">{t('DCA.frequencyLabel')}</Label>
               <Input id="frequency" value={t('DCA.weekly')} disabled />
            </div>
             <div className="space-y-2">
              <Label htmlFor="period">{t('DCA.periodLabel')}</Label>
               <Input id="period" value={`${t('DCA.oneYear')} (${currentYear - 1})`} disabled />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSimulate} className="w-full">
              {t('DCA.runButton')}
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="font-headline">{t('DCA.resultsTitle')}</CardTitle>
            <CardDescription>
              {result
                ? `${t('DCA.finalValue')}: $${result.finalValue} | ${t('DCA.totalInvested')}: $${result.totalInvested} | ${t('DCA.roi')}: ${result.roi}%`
                : t('DCA.runToSeeResults')}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {result ? (
              <ChartContainer
                config={chartConfig}
                className="h-full w-full"
              >
                <AreaChart
                  data={result.data}
                  margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `$${Number(value) / 1000}k`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <defs>
                    <linearGradient id="fillPortfolio" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-portfolioValue)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-portfolioValue)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="Portfolio Value"
                    type="natural"
                    fill="url(#fillPortfolio)"
                    stroke="var(--color-portfolioValue)"
                    stackId="a"
                  />
                  <Area
                    dataKey="Total Invested"
                    type="natural"
                    fill="var(--color-totalInvested)"
                    fillOpacity={0.4}
                    stroke="var(--color-totalInvested)"
                    stackId="b"
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Calculator className="h-16 w-16" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

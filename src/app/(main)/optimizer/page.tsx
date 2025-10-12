'use client';

import { useState } from 'react';
import { Target } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis, Label } from 'recharts';
import { optimizerAssets, efficientFrontierData } from '@/lib/data';
import type { PortfolioAsset } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const chartConfig = {
  risk: {
    label: 'Risk (Volatility)',
    color: 'hsl(var(--muted-foreground))',
  },
  return: {
    label: 'Return',
    color: 'hsl(var(--chart-1))',
  },
};

export default function OptimizerPage() {
  const [selectedAssets, setSelectedAssets] = useState<string[]>(['BTC-USD', 'ETH-USD']);
  const [showResult, setShowResult] = useState(false);

  const toggleAsset = (ticker: string) => {
    setSelectedAssets((prev) =>
      prev.includes(ticker)
        ? prev.filter((t) => t !== ticker)
        : [...prev, ticker]
    );
  };
  
  const handleOptimize = () => {
    if (selectedAssets.length > 1) {
      setShowResult(true);
    }
  };


  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Portfolio Optimizer</CardTitle>
            <CardDescription>
              Find the optimal allocation for your crypto portfolio using Modern Portfolio Theory. Select 2 or more assets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {optimizerAssets.map((asset) => (
                <Badge
                  key={asset.ticker}
                  variant={selectedAssets.includes(asset.ticker) ? 'default' : 'secondary'}
                  onClick={() => toggleAsset(asset.ticker)}
                  className="cursor-pointer"
                >
                  {asset.name}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardContent>
             <Button onClick={handleOptimize} className="w-full" disabled={selectedAssets.length < 2}>
              Calculate Efficient Frontier
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="font-headline">Efficient Frontier</CardTitle>
             <CardDescription>
              {showResult
                ? 'Each point represents an optimal portfolio for a given level of risk.'
                : 'Select assets and calculate to see the efficient frontier.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {showResult ? (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="Risk"
                  name="Risk"
                  unit=""
                  tickLine={false} axisLine={false}
                  tickMargin={8}
                >
                  <Label value="Risk (Standard Deviation)" offset={-25} position="insideBottom" />
                </XAxis>
                <YAxis
                  type="number"
                  dataKey="Return"
                  name="Return"
                  unit=""
                  tickLine={false} axisLine={false}
                  tickMargin={8}
                >
                   <Label value="Expected Return" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                </YAxis>
                <ChartTooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={<ChartTooltipContent />}
                />
                <Scatter name="Portfolios" data={efficientFrontierData} fill="var(--color-return)" />
              </ScatterChart>
            </ChartContainer>
             ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Target className="h-16 w-16" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

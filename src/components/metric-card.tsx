
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MetricCardData } from '@/lib/types';

interface MetricCardProps {
  metric: MetricCardData;
}

export function MetricCard({ metric }: MetricCardProps) {
  const changeColor =
    metric.changeType === 'positive'
      ? 'text-green-500'
      : metric.changeType === 'negative'
      ? 'text-red-500'
      : 'text-muted-foreground';

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription>{metric.title}</CardDescription>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{metric.tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardTitle asChild>
          <h3 className="text-4xl font-bold">{metric.value}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'text-xs',
            changeColor
          )}
        >
          {metric.change}
        </div>
        <p className="text-xs text-muted-foreground">{metric.description}</p>
      </CardContent>
    </Card>
  );
}

    
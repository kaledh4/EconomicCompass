
import type { LucideIcon } from 'lucide-react';

// A function that takes a translation key and returns a string
export type I18n = (key: string, params?: Record<string, string | number>) => string;

export type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type MetricCardData = {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  description: string;
  tooltipText: string;
};

export type ChartDataPoint = {
  date: string;
  [key: string]: any;
};

export type PortfolioAsset = {
  ticker: string;
  name: string;
};

export type NewsArticle = {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
};

    
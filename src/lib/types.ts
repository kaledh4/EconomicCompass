import type { LucideIcon } from 'lucide-react';

export type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type MetricCard = {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  description: string;
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

import type { NavLink } from '@/lib/types';
import {
  LayoutDashboard,
  Bitcoin,
  Calculator,
  Target,
  Bell,
} from 'lucide-react';

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Macro Dashboard', icon: LayoutDashboard },
  { href: '/crypto', label: 'Crypto Overview', icon: Bitcoin },
  { href: '/dca', label: 'DCA Simulator', icon: Calculator },
  { href: '/optimizer', label: 'Portfolio Optimizer', icon: Target },
  { href: '/alerts', label: 'Economic Alerts', icon: Bell },
];

export const MOCK_USER = {
  name: 'Analyst',
  email: 'analyst@economic-compass.com',
  avatar: 'https://picsum.photos/seed/1/100/100',
};

import type { NavLink } from '@/lib/types';
import {
  LayoutDashboard,
  Bitcoin,
  Calculator,
  Target,
  Bell,
  Newspaper,
} from 'lucide-react';
import type { I18n } from './types';


export const getNavLinks = (t: I18n): NavLink[] => [
  { href: '/', label: t('Nav.macro'), icon: LayoutDashboard },
  { href: '/crypto', label: t('Nav.crypto'), icon: Bitcoin },
  { href: '/dca', label: t('Nav.dca'), icon: Calculator },
  { href: '/optimizer', label: t('Nav.optimizer'), icon: Target },
  { href: '/alerts', label: t('Nav.alerts'), icon: Bell },
  { href: '/news', label: t('Nav.news'), icon: Newspaper },
];

export const MOCK_USER = {
  name: 'Analyst',
  email: 'analyst@economic-compass.com',
  avatar: 'https://picsum.photos/seed/1/100/100',
};

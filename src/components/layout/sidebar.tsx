'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { getNavLinks } from '@/lib/constants';
import { Icons } from '@/components/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslations } from 'next-intl';

interface SidebarNavProps {
  isMobile?: boolean;
}

export function SidebarNav({ isMobile = false }: SidebarNavProps) {
  const pathname = usePathname();
  const t = useTranslations();
  const navLinks = getNavLinks(t);

  return (
    <>
      {navLinks.map((link) => {
        const Icon = link.icon;
        const cleanedPathname = pathname.split('/').slice(0, 2).join('/');
        const isActive = cleanedPathname === link.href;

        return isMobile ? (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-4 px-2.5',
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            {link.label}
          </Link>
        ) : (
          <Tooltip key={link.href} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href={link.href}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{link.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-sans">
              {link.label}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </>
  );
}


export function Sidebar() {
  const t = useTranslations();
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Icons.Compass className="h-5 w-5 transition-all group-hover:scale-110 group-hover:rotate-12" />
            <span className="sr-only">{t('appName')}</span>
          </Link>
          <SidebarNav />
        </nav>
      </TooltipProvider>
    </aside>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as LucideIcons from 'lucide-react';

import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants';
import { Icons } from '@/components/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarNavProps {
  isMobile?: boolean;
}

export function SidebarNav({ isMobile = false }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <>
      {NAV_LINKS.map((link) => {
        const Icon = (LucideIcons as any)[link.icon];
        return isMobile ? (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-4 px-2.5',
              pathname === link.href
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
                  pathname === link.href
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
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Icons.Compass className="h-5 w-5 transition-all group-hover:scale-110 group-hover:rotate-12" />
            <span className="sr-only">Economic Compass</span>
          </Link>
          <SidebarNav />
        </nav>
      </TooltipProvider>
    </aside>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { NAV_LINKS } from '@/lib/constants';
import { Icons } from '../icons';
import { SidebarNav } from './sidebar';
import { ThemeToggle } from '../theme-toggle';
import { UserNav } from '../user-nav';
import { LanguageToggle } from '../language-toggle';

export function Header() {
  const pathname = usePathname();
  const pageTitle =
    NAV_LINKS.find((link) => link.href === pathname)?.label || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Icons.Compass className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Economic Compass</span>
            </Link>
            <SidebarNav isMobile={true} />
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex-1">
        <h1 className="font-headline text-xl font-semibold">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}

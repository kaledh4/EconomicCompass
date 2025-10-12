import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { SettingsProvider } from '@/contexts/settings-context';
import { I18nProvider } from '@/contexts/i18n-context';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Economic Compass',
  description: 'Free, open-source macro risk & crypto analytics dashboard.',
  manifest: '/manifest.json',
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#161a25" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased')}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SettingsProvider>
            <I18nProvider>
              {children}
              <Toaster />
            </I18nProvider>
          </SettingsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

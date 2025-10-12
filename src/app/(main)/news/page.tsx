'use client';
import { getNewsFeed } from '@/lib/data';
import type { NewsArticle } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function NewsPage() {
  const t = useTranslations('News');
  const [news, setNews] = useState<{ articles: NewsArticle[], error?: string }>({ articles: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      const newsData = await getNewsFeed();
      setNews(newsData);
      setLoading(false);
    }
    loadNews();
  }, []);

  if (loading) {
     return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Card key={i} className="flex animate-pulse flex-col overflow-hidden">
            <CardHeader>
              <div className="relative h-48 w-full bg-muted"></div>
              <div className="h-6 w-3/4 rounded bg-muted pt-4"></div>
              <div className="h-4 w-1/2 rounded bg-muted"></div>
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
              <div className="h-4 w-full rounded bg-muted"></div>
              <div className="h-4 w-full rounded bg-muted"></div>
              <div className="h-4 w-3/4 rounded bg-muted"></div>
            </CardContent>
            <CardFooter>
              <div className="h-5 w-20 rounded bg-muted"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (news.error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">{news.error}</p>
      </div>
    );
  }
  
  if (!news.articles || news.articles.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>{t('noArticles')}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {news.articles.map((article: NewsArticle, index: number) => (
        <Card
          key={index}
          className="flex flex-col overflow-hidden"
        >
          <CardHeader>
            {article.image && (
              <div className="relative h-48 w-full">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="rounded-t-lg object-cover"
                  data-ai-hint="news article image"
                />
              </div>
            )}
            <CardTitle className="pt-4 font-headline text-lg">
              {article.title}
            </CardTitle>
            <CardDescription className="text-xs">
              {new Date(article.publishedAt).toLocaleString()} -{' '}
              {article.source.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">
              {article.description}
            </p>
          </CardContent>
          <CardFooter>
            <Link
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-primary hover:underline"
            >
              {t('readMore')}
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

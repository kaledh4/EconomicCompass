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

export const revalidate = 3600; // Revalidate every hour

export default async function NewsPage() {
  const { articles, error } = await getNewsFeed();

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }
  
  if (!articles || articles.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>No news articles found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article: NewsArticle, index: number) => (
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
              Read More
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

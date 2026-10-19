import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { defaultLocale, locales } from "@/i18n/config";
import { localizePath, type Pathname } from "@/i18n/routing";
import { getArticles } from "@/lib/content";

/**
 * Every public page in each language: the home page (its sections are anchors, so it's
 * one page), the articles list and each published article.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const absolute = (path: string) => new URL(path, siteConfig.url).toString();
  // Every locale has the same article slugs and dates.
  const articles = await getArticles(defaultLocale);

  const pages: { pathname: Pathname; lastModified?: string; priority: number }[] = [
    { pathname: "/", lastModified: articles[0]?.date, priority: 1 },
    ...(articles.length
      ? [{ pathname: "/articles" as const, lastModified: articles[0].date, priority: 0.8 }]
      : []),
    ...articles.map((article) => ({
      pathname: `/articles/${article.slug}` as const,
      lastModified: article.date,
      priority: 0.7,
    })),
  ];

  return pages.flatMap(({ pathname, lastModified, priority }) =>
    locales.map((locale) => ({
      url: absolute(localizePath(locale, pathname)),
      lastModified,
      priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, absolute(localizePath(l, pathname))]),
        ),
      },
    })),
  );
}

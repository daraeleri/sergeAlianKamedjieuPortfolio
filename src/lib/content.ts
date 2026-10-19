import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { ArticleBlock } from "@/content/article-bodies";
import type { Locale } from "@/i18n/config";
import { db } from "@/lib/db";
import type { ArticleCardData, ArticleTheme } from "@/lib/articles";

/**
 * Published content for the public site, read from the database. Cached until the
 * dashboard changes it: saving an article or book calls `updateTag("articles")` or
 * `updateTag("books")`.
 */

export const ARTICLES_TAG = "articles";
export const BOOKS_TAG = "books";

const themes = new Set<ArticleTheme>([
  "spirit",
  "leadership",
  "scripture",
  "mission",
  "life",
  "training",
]);

function toTheme(value: string): ArticleTheme {
  return themes.has(value as ArticleTheme) ? (value as ArticleTheme) : "spirit";
}

const published = { status: "published" as const, publishedAt: { lte: new Date() } };

/** Published articles in one language, newest first, ready for article cards. */
export async function getArticles(locale: Locale): Promise<ArticleCardData[]> {
  "use cache";
  cacheTag(ARTICLES_TAG);
  cacheLife("max");

  const rows = await db.article.findMany({
    where: published,
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      titleEn: true,
      titleFr: true,
      categoryEn: true,
      categoryFr: true,
      excerptEn: true,
      excerptFr: true,
      cover: true,
      theme: true,
      publishedAt: true,
    },
  });
  const dateFormat = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const fr = locale === "fr";

  return rows.map((row) => {
    const date = row.publishedAt ?? new Date();
    return {
      slug: row.id,
      title: fr ? row.titleFr || row.titleEn : row.titleEn || row.titleFr,
      category: fr ? row.categoryFr || row.categoryEn : row.categoryEn || row.categoryFr,
      excerpt: fr ? row.excerptFr || row.excerptEn : row.excerptEn || row.excerptFr,
      date: date.toISOString().slice(0, 10),
      dateLabel: dateFormat.format(date),
      theme: toTheme(row.theme),
      image: row.cover ?? undefined,
    };
  });
}

/** Body of a published article in one language, or null. */
export async function getArticleBody(locale: Locale, slug: string) {
  "use cache";
  cacheTag(ARTICLES_TAG);
  cacheLife("max");

  const row = await db.article.findFirst({
    where: { id: slug, ...published },
    select: { bodyEn: true, bodyFr: true },
  });
  if (!row) return null;
  const body = (locale === "fr" ? row.bodyFr : row.bodyEn) as ArticleBlock[];
  // Fall back to the other language while a translation is missing.
  return body.length ? body : ((locale === "fr" ? row.bodyEn : row.bodyFr) as ArticleBlock[]);
}

export type PublicBook = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  cover?: string;
};

/** Published books in one language, in their home-page order. */
export async function getBooks(locale: Locale): Promise<PublicBook[]> {
  "use cache";
  cacheTag(BOOKS_TAG);
  cacheLife("max");

  const rows = await db.book.findMany({
    where: { status: "published" },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });
  const fr = locale === "fr";
  return rows.map((row) => ({
    slug: row.id,
    title: row.title,
    description: fr ? row.descriptionFr || row.descriptionEn : row.descriptionEn,
    tags: fr && row.tagsFr.length ? row.tagsFr : row.tagsEn,
    cover: row.cover ?? undefined,
  }));
}

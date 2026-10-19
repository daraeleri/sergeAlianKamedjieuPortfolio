import { articleMeta, type ArticleTheme } from "@/content/articles";
import type { Route } from "next";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";

export type { ArticleTheme };

export type ArticleCardData = Dictionary["articles"]["items"][number] & {
  /** ISO date for the <time> element. */
  date: string;
  /** Date formatted for the current locale (done on the server). */
  dateLabel: string;
  theme: ArticleTheme;
  image?: string;
};

/** Author photo used in article bylines. */
export const articleAvatar = "/images/PersonaImage.png";

/** Page of one article, e.g. "/fr/articles/leadership-serviteur". */
export function articleHref(locale: Locale, slug: string): Route {
  return localizePath(locale, `/articles/${slug}`);
}

/** Translated articles joined with their date, theme and image, newest first. */
export function getArticles(locale: Locale, copy: Dictionary["articles"]): ArticleCardData[] {
  const dateFormat = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return copy.items
    .flatMap((article) => {
      const meta = articleMeta[article.slug];
      if (!meta) return [];
      return [{ ...article, ...meta, dateLabel: dateFormat.format(new Date(meta.date)) }];
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

import { articleMeta, type ArticleTheme } from "@/content/articles";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

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

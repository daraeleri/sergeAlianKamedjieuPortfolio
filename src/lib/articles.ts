import type { Route } from "next";
import type { ArticleTheme } from "@/content/articles";
import type { Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/routing";

export type { ArticleTheme };

/** An article as shown on cards, in one language. */
export type ArticleCardData = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
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

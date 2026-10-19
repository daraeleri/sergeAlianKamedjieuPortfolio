/**
 * Locale-independent details of each article, keyed by the `slug` of each article in the
 * dictionaries (`articles.items`), which hold the translated title, category and excerpt.
 *
 * SAMPLE CONTENT: these six articles are placeholders to design the section. Replace them
 * with real articles (later managed from the dashboard, with an article detail page).
 *
 * `image`: put the photo in /public/images/articles and set its path here. Articles
 * without an image show a designed background in the colours of their `theme`.
 */

export type ArticleTheme = "spirit" | "leadership" | "scripture" | "mission" | "life" | "training";

export type ArticleMeta = {
  /** Publication date, ISO format (YYYY-MM-DD). */
  date: string;
  theme: ArticleTheme;
  image?: string;
};

export const articleMeta: Record<string, ArticleMeta> = {
  "plenitude-du-saint-esprit": { date: "2026-10-05", theme: "spirit" },
  "leadership-serviteur": { date: "2026-09-21", theme: "leadership" },
  "autorite-des-ecritures-aujourd-hui": { date: "2026-09-08", theme: "scripture" },
  "de-bafoussam-aux-nations": { date: "2026-08-24", theme: "mission" },
  "foi-esperance-amour": { date: "2026-08-10", theme: "life" },
  "former-des-leaders": { date: "2026-07-27", theme: "training" },
};

import type { ArticleBlock } from "@/content/article-bodies";
import type { ArticleDoc, BookDoc } from "./types";

/**
 * Publish readiness: a checklist per content type. The percentage of completed steps
 * drives the progress bars in the lists and the ring in the editors. Keys match
 * `dashboard.editor.checks` in the dictionaries.
 */
export type Check = { key: string; done: boolean };

export type Readiness = { checks: Check[]; percent: number; ready: boolean };

/** Minimum length of an article body to publish. */
export const MIN_WORDS = 150;

function result(checks: Check[]): Readiness {
  const done = checks.filter((check) => check.done).length;
  const percent = Math.round((done / checks.length) * 100);
  return { checks, percent, ready: done === checks.length };
}

/** Words in a list of blocks (headings, verses, quotes, lists and captions included). */
export function countWords(blocks: ArticleBlock[]) {
  return blocks
    .map((block) => {
      if (block.type === "list") return block.items.join(" ");
      if (block.type === "image") return block.caption ?? "";
      return block.text;
    })
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
}

const filled = (text: string, min = 1) => text.trim().length >= min;

export function articleReadiness(
  article: Pick<ArticleDoc, "title" | "category" | "excerpt" | "cover" | "body">,
) {
  const blocks =
    article.body.en.length >= article.body.fr.length ? article.body.en : article.body.fr;
  const headings = blocks.filter((block) => block.type === "h2" && filled(block.text)).length;
  return result([
    { key: "title", done: filled(article.title.en, 10) || filled(article.title.fr, 10) },
    { key: "category", done: filled(article.category.en) || filled(article.category.fr) },
    { key: "excerpt", done: filled(article.excerpt.en, 80) || filled(article.excerpt.fr, 80) },
    { key: "cover", done: Boolean(article.cover) },
    { key: "length", done: countWords(blocks) >= MIN_WORDS },
    { key: "headings", done: headings >= 2 },
    {
      key: "translation",
      done:
        filled(article.title.en) &&
        filled(article.title.fr) &&
        filled(article.excerpt.en) &&
        filled(article.excerpt.fr),
    },
  ]);
}

export function bookReadiness(
  book: Pick<BookDoc, "title" | "description" | "cover" | "tags" | "pages" | "year">,
) {
  return result([
    { key: "title", done: filled(book.title, 10) },
    {
      key: "description",
      done: filled(book.description.en, 80) || filled(book.description.fr, 80),
    },
    { key: "cover", done: Boolean(book.cover) },
    { key: "tags", done: book.tags.some((tag) => filled(tag)) },
    { key: "pages", done: Boolean(book.pages && book.pages > 0) },
    { key: "year", done: Boolean(book.year && book.year > 1900) },
    {
      key: "bookTranslation",
      done: filled(book.description.en) && filled(book.description.fr),
    },
  ]);
}

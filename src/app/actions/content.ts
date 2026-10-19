"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { defaultLocale } from "@/i18n/config";
import { getCurrentUser } from "@/lib/auth/session";
import { ARTICLES_TAG, BOOKS_TAG } from "@/lib/content";
import { db } from "@/lib/db";
import { contentStatuses } from "@/lib/dashboard/types";

/**
 * Saving articles and books from the dashboard editors. Each save returns the record's
 * id (new records get one from their title) and refreshes the public pages when the
 * change affects what visitors see.
 */

export type SaveResult =
  | { ok: true; id: string; updatedAt: string }
  | { ok: false; error: "unauthorized" | "invalid" | "failed" };

const text = (max: number) => z.string().max(max);
const bilingual = (max: number) => z.object({ en: text(max), fr: text(max) });
const status = z.enum(contentStatuses as [string, ...string[]]);
/** Paths, web URLs, a theme ("theme:spirit") or, until uploads use file storage, an image. */
const image = z
  .string()
  .max(3_000_000)
  .refine((value) => /^(\/|https:\/\/|theme:|data:image\/(png|jpe?g|webp|gif);base64,)/.test(value))
  .optional();

const block = z.discriminatedUnion("type", [
  z.object({ type: z.literal("p"), text: text(20_000) }),
  z.object({ type: z.literal("h2"), id: text(120), text: text(300) }),
  z.object({ type: z.literal("h3"), text: text(300) }),
  z.object({ type: z.literal("verse"), text: text(3000), reference: text(200) }),
  z.object({ type: z.literal("quote"), text: text(3000), cite: text(200).optional() }),
  z.object({
    type: z.literal("list"),
    ordered: z.boolean().optional(),
    items: z.array(text(3000)).max(200),
  }),
  z.object({
    type: z.literal("image"),
    src: image.unwrap(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    alt: text(300),
    caption: text(500).optional(),
    wide: z.boolean().optional(),
    framed: z.boolean().optional(),
  }),
]);

const articleSchema = z.object({
  status,
  category: bilingual(80),
  title: bilingual(200),
  excerpt: bilingual(600),
  cover: image,
  body: z.object({ en: z.array(block).max(500), fr: z.array(block).max(500) }),
});

const bookSchema = z.object({
  status,
  title: text(200),
  description: bilingual(2000),
  tags: z.object({ en: z.array(text(60)).max(12), fr: z.array(text(60)).max(12) }),
  cover: image,
  pages: z.number().int().min(1).max(5000).optional(),
  year: z.number().int().min(1900).max(2100).optional(),
});

/** URL slug from a title: "Le Saint-Esprit et l'Église" → "le-saint-esprit-et-l-eglise". */
function slugify(value: string) {
  return (
    value
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "untitled"
  );
}

async function uniqueId(base: string, exists: (id: string) => Promise<boolean>) {
  let id = base;
  for (let n = 2; await exists(id); n++) id = `${base}-${n}`;
  return id;
}

export async function saveArticle(id: string | null, input: unknown): Promise<SaveResult> {
  if (!(await getCurrentUser())) return { ok: false, error: "unauthorized" };
  const parsed = articleSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const draft = parsed.data;

  const theme = draft.cover?.startsWith("theme:") ? draft.cover.slice(6) : undefined;
  const data = {
    status: draft.status as (typeof contentStatuses)[number],
    categoryEn: draft.category.en,
    categoryFr: draft.category.fr,
    titleEn: draft.title.en,
    titleFr: draft.title.fr,
    excerptEn: draft.excerpt.en,
    excerptFr: draft.excerpt.fr,
    cover: theme ? null : (draft.cover ?? null),
    ...(theme ? { theme } : {}),
    bodyEn: draft.body.en,
    bodyFr: draft.body.fr,
  };

  try {
    const existing = id
      ? await db.article.findUnique({ where: { id }, select: { status: true, publishedAt: true } })
      : null;
    const publishedAt =
      data.status === "published" ? (existing?.publishedAt ?? new Date()) : existing?.publishedAt;

    const saved = existing
      ? await db.article.update({
          where: { id: id! },
          data: { ...data, publishedAt },
          select: { id: true, updatedAt: true },
        })
      : await db.article.create({
          data: {
            id: await uniqueId(
              slugify(draft.title[defaultLocale] || draft.title.fr || draft.title.en),
              async (candidate) => Boolean(await db.article.count({ where: { id: candidate } })),
            ),
            ...data,
            publishedAt,
          },
          select: { id: true, updatedAt: true },
        });

    // Visitors only see published articles; refresh when that set or its content changes.
    if (data.status === "published" || existing?.status === "published") updateTag(ARTICLES_TAG);
    return { ok: true, id: saved.id, updatedAt: saved.updatedAt.toISOString() };
  } catch (error) {
    console.error("[content] Could not save article:", error);
    return { ok: false, error: "failed" };
  }
}

export async function saveBook(id: string | null, input: unknown): Promise<SaveResult> {
  if (!(await getCurrentUser())) return { ok: false, error: "unauthorized" };
  const parsed = bookSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const draft = parsed.data;

  const data = {
    status: draft.status as (typeof contentStatuses)[number],
    title: draft.title,
    descriptionEn: draft.description.en,
    descriptionFr: draft.description.fr,
    tagsEn: draft.tags.en,
    tagsFr: draft.tags.fr,
    cover: draft.cover && !draft.cover.startsWith("theme:") ? draft.cover : null,
    pages: draft.pages ?? null,
    year: draft.year ?? null,
  };

  try {
    const existing = id
      ? await db.book.findUnique({ where: { id }, select: { status: true } })
      : null;
    const saved = existing
      ? await db.book.update({ where: { id: id! }, data, select: { id: true, updatedAt: true } })
      : await db.book.create({
          data: {
            id: await uniqueId(slugify(draft.title), async (candidate) =>
              Boolean(await db.book.count({ where: { id: candidate } })),
            ),
            position: await db.book.count(),
            ...data,
          },
          select: { id: true, updatedAt: true },
        });

    if (data.status === "published" || existing?.status === "published") updateTag(BOOKS_TAG);
    return { ok: true, id: saved.id, updatedAt: saved.updatedAt.toISOString() };
  } catch (error) {
    console.error("[content] Could not save book:", error);
    return { ok: false, error: "failed" };
  }
}

/** Marks a contact message as read or unread. */
export async function setMessageRead(id: string, read: boolean) {
  if (!(await getCurrentUser())) return { ok: false };
  await db.message.updateMany({ where: { id }, data: { read } });
  return { ok: true };
}

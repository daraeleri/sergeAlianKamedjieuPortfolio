import "server-only";
import { randomBytes } from "node:crypto";
import { after } from "next/server";
import { hasLocale, type Locale } from "@/i18n/config";
import { db } from "@/lib/db";
import { emailConfig, emailEnabled, sendEmail, sendEmails } from "@/lib/email/send";
import {
  articleEmail,
  authorReportEmail,
  authorSubscriberEmail,
  bookEmail,
  confirmEmail,
  welcomeEmail,
} from "@/lib/email/templates";

/**
 * Newsletter: double opt-in subscriptions (a confirmation email before anything else
 * is sent), unsubscribing, and announcing a new article or book to active subscribers.
 * Emails go out after the response (`after`), so forms and buttons answer at once.
 */

const newToken = () => randomBytes(24).toString("base64url");
const asLocale = (value: string): Locale => (hasLocale(value) ? value : "en");

/**
 * Starts a subscription and sends the confirmation email. Someone already subscribed
 * gets nothing, and the answer is the same either way, so the form never reveals
 * whether an address is on the list.
 */
export async function subscribe(email: string, locale: Locale) {
  const address = email.trim().toLowerCase();
  const existing = await db.subscriber.findUnique({ where: { email: address } });
  if (existing?.status === "active") return;

  const subscriber = existing
    ? await db.subscriber.update({
        where: { id: existing.id },
        data: { status: "pending", token: newToken(), locale, unsubscribedAt: null },
      })
    : await db.subscriber.create({ data: { email: address, locale, token: newToken() } });

  after(() =>
    sendEmail(confirmEmail({ email: subscriber.email, locale, token: subscriber.token })),
  );
}

export type ConfirmResult = "confirmed" | "already" | "invalid";

/** Activates a subscription from the link in the confirmation email. */
export async function confirm(token: string): Promise<ConfirmResult> {
  const subscriber = await db.subscriber.findUnique({ where: { token } });
  if (!subscriber || subscriber.status === "unsubscribed") return "invalid";
  if (subscriber.status === "active") return "already";

  await db.subscriber.update({
    where: { id: subscriber.id },
    data: { status: "active", confirmedAt: new Date() },
  });

  after(async () => {
    const locale = asLocale(subscriber.locale);
    const total = await db.subscriber.count({ where: { status: "active" } });
    await Promise.all([
      sendEmail(welcomeEmail({ email: subscriber.email, locale, token: subscriber.token })),
      sendEmail(authorSubscriberEmail(emailConfig.authorEmail, subscriber, total)),
    ]);
  });
  return "confirmed";
}

/** Stops all emails to the subscriber with this token. */
export async function unsubscribe(token: string): Promise<boolean> {
  const { count } = await db.subscriber.updateMany({
    where: { token, status: { not: "unsubscribed" } },
    data: { status: "unsubscribed", unsubscribedAt: new Date() },
  });
  if (count) return true;
  // Unsubscribing twice is still a success for the visitor.
  return Boolean(await db.subscriber.count({ where: { token } }));
}

export type AnnounceResult =
  | { ok: true; total: number }
  | { ok: false; error: "not-published" | "already-sent" | "no-subscribers" | "email-off" };

async function activeSubscribers() {
  const rows = await db.subscriber.findMany({
    where: { status: "active" },
    select: { email: true, locale: true, token: true },
  });
  return rows.map((row) => ({ ...row, locale: asLocale(row.locale) }));
}

/** Checks shared by both announcements; returns the subscribers to email. */
async function prepare(
  announcedAt: Date | null | undefined,
  published: boolean,
): Promise<
  | { ok: true; subscribers: Awaited<ReturnType<typeof activeSubscribers>> }
  | Extract<AnnounceResult, { ok: false }>
> {
  if (!published) return { ok: false, error: "not-published" };
  if (announcedAt) return { ok: false, error: "already-sent" };
  // In development emails are printed to the log, so announcing can be tried locally.
  if (!emailEnabled() && process.env.NODE_ENV === "production") {
    return { ok: false, error: "email-off" };
  }
  const subscribers = await activeSubscribers();
  if (!subscribers.length) return { ok: false, error: "no-subscribers" };
  return { ok: true, subscribers };
}

/** Emails a published article to every active subscriber, once. */
export async function announceArticle(id: string): Promise<AnnounceResult> {
  const article = await db.article.findUnique({ where: { id } });
  const ready = await prepare(article?.announcedAt, article?.status === "published");
  if (!ready.ok) return ready;

  // Claim the announcement first, so a double click can't send it twice.
  const { count } = await db.article.updateMany({
    where: { id, announcedAt: null },
    data: { announcedAt: new Date(), announcedTo: 0 },
  });
  if (!count) return { ok: false, error: "already-sent" };

  const { subscribers } = ready;
  after(async () => {
    const emails = subscribers.map((subscriber) => {
      const fr = subscriber.locale === "fr";
      return articleEmail(subscriber, {
        id: article!.id,
        title: (fr ? article!.titleFr : article!.titleEn) || article!.titleEn || article!.titleFr,
        excerpt: (fr ? article!.excerptFr : article!.excerptEn) || article!.excerptEn,
        category: (fr ? article!.categoryFr : article!.categoryEn) || article!.categoryEn,
        cover: article!.cover,
      });
    });
    const sent = await sendEmails(emails);
    await db.article.update({ where: { id }, data: { announcedTo: sent } });
    await sendEmail(
      authorReportEmail(emailConfig.authorEmail, {
        kind: "article",
        title: article!.titleEn || article!.titleFr,
        sent,
        total: emails.length,
      }),
    );
  });
  return { ok: true, total: subscribers.length };
}

/** Emails a published book to every active subscriber, once. */
export async function announceBook(id: string): Promise<AnnounceResult> {
  const book = await db.book.findUnique({ where: { id } });
  const ready = await prepare(book?.announcedAt, book?.status === "published");
  if (!ready.ok) return ready;

  const { count } = await db.book.updateMany({
    where: { id, announcedAt: null },
    data: { announcedAt: new Date(), announcedTo: 0 },
  });
  if (!count) return { ok: false, error: "already-sent" };

  const { subscribers } = ready;
  after(async () => {
    const emails = subscribers.map((subscriber) =>
      bookEmail(subscriber, {
        title: book!.title,
        description:
          (subscriber.locale === "fr" ? book!.descriptionFr : book!.descriptionEn) ||
          book!.descriptionEn,
        cover: book!.cover,
      }),
    );
    const sent = await sendEmails(emails);
    await db.book.update({ where: { id }, data: { announcedTo: sent } });
    await sendEmail(
      authorReportEmail(emailConfig.authorEmail, {
        kind: "book",
        title: book!.title,
        sent,
        total: emails.length,
      }),
    );
  });
  return { ok: true, total: subscribers.length };
}

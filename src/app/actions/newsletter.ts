"use server";

import { z } from "zod";
import { hasLocale } from "@/i18n/config";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import {
  announceArticle,
  announceBook,
  confirm,
  subscribe,
  unsubscribe,
  type AnnounceResult,
  type ConfirmResult,
} from "@/lib/newsletter";

export type SubscribeState = { status: "idle" | "success" | "invalid" | "error"; email?: string };

const token = z.string().min(20).max(100);

/** Footer newsletter form (used with `useActionState`). */
export async function subscribeToNewsletter(
  _previous: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  // Honeypot: hidden from people, often filled by bots.
  if (String(formData.get("website") ?? "") !== "") return { status: "success" };

  const email = String(formData.get("email") ?? "");
  const parsed = z.email().max(200).safeParse(email.trim());
  if (!parsed.success) return { status: "invalid", email };

  const locale = String(formData.get("locale") ?? "");
  try {
    await subscribe(parsed.data, hasLocale(locale) ? locale : "en");
    return { status: "success" };
  } catch (error) {
    console.error("[newsletter] Could not subscribe:", error);
    return { status: "error", email };
  }
}

/** Called by the confirmation page with the token from the email link. */
export async function confirmSubscription(value: string): Promise<ConfirmResult> {
  const parsed = token.safeParse(value);
  return parsed.success ? confirm(parsed.data) : "invalid";
}

/** Called by the unsubscribe page when the visitor presses the button. */
export async function unsubscribeFromNewsletter(value: string): Promise<boolean> {
  const parsed = token.safeParse(value);
  return parsed.success ? unsubscribe(parsed.data) : false;
}

/** Dashboard: email a published article or book to the subscribers. */
export async function announce(
  kind: "article" | "book",
  id: string,
): Promise<AnnounceResult | { ok: false; error: "unauthorized" }> {
  if (!(await getCurrentUser())) return { ok: false, error: "unauthorized" };
  return kind === "article" ? announceArticle(id) : announceBook(id);
}

/** Dashboard: removes a subscriber for good. */
export async function deleteSubscriber(id: string) {
  if (!(await getCurrentUser())) return { ok: false };
  await db.subscriber.deleteMany({ where: { id } });
  return { ok: true };
}

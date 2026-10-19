"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { hasLocale, defaultLocale } from "@/i18n/config";
import { localizePath } from "@/i18n/routing";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { db } from "@/lib/db";

export type SignInState = { error?: "invalid" | "generic"; email?: string } | undefined;

const schema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1).max(200),
});

/** Same work for unknown emails, so response time doesn't reveal which accounts exist. */
const DUMMY_HASH =
  "scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$" + Buffer.alloc(64).toString("base64");

export async function signIn(_state: SignInState, formData: FormData): Promise<SignInState> {
  const lang = String(formData.get("lang") ?? "");
  const locale = hasLocale(lang) ? lang : defaultLocale;
  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "invalid", email: String(formData.get("email") ?? "") };

  const { email, password } = parsed.data;
  try {
    const user = await db.user.findUnique({ where: { email } });
    const valid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !valid) return { error: "invalid", email };
    await createSession(user.id);
  } catch (error) {
    console.error("[auth] Sign-in failed:", error);
    return { error: "generic", email };
  }

  // Only return to a dashboard page, never to another site.
  const next = String(formData.get("next") ?? "");
  const dashboard = localizePath(locale, "/dashboard");
  redirect(next.startsWith(`${dashboard}`) ? (next as typeof dashboard) : dashboard);
}

export async function signOut(formData: FormData) {
  const lang = String(formData.get("lang") ?? "");
  await destroySession();
  redirect(localizePath(hasLocale(lang) ? lang : defaultLocale, "/login"));
}

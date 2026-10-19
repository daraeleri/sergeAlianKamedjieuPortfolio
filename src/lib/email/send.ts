import "server-only";
import { siteConfig } from "@/config/site";

/**
 * Email delivery through Resend's HTTP API (https://resend.com/docs/api-reference).
 * Without RESEND_API_KEY nothing is sent: in development the email is printed to the
 * server log instead (links included), so the flows can be tried locally.
 */

export type Email = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  headers?: Record<string, string>;
};

const API = "https://api.resend.com";
/** Resend accepts at most 100 emails per batch request. */
const BATCH_SIZE = 100;

export const emailConfig = {
  apiKey: process.env.RESEND_API_KEY,
  /** Sender, e.g. "Serge Alain Kamedjieu <news@your-domain.com>" (domain verified in Resend). */
  from: process.env.EMAIL_FROM || `${siteConfig.name} <onboarding@resend.dev>`,
  /** Where the author's notifications go. */
  authorEmail: process.env.AUTHOR_EMAIL || siteConfig.contactEmail,
};

export const emailEnabled = () => Boolean(emailConfig.apiKey);

function toResend(email: Email) {
  return {
    from: emailConfig.from,
    to: [email.to],
    subject: email.subject,
    html: email.html,
    text: email.text,
    ...(email.replyTo ? { reply_to: email.replyTo } : {}),
    ...(email.headers ? { headers: email.headers } : {}),
  };
}

async function post(path: string, body: unknown) {
  const response = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${emailConfig.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${await response.text()}`);
  }
}

function logInstead(email: Email) {
  if (process.env.NODE_ENV === "production") {
    console.warn(`[email] RESEND_API_KEY is not set; not sent: "${email.subject}" to ${email.to}`);
  } else {
    console.info(
      `\n[email] (not sent, no RESEND_API_KEY)\nTo: ${email.to}\nSubject: ${email.subject}\n\n${email.text}\n`,
    );
  }
}

/** Sends one email. Returns false (and logs) instead of throwing when it fails. */
export async function sendEmail(email: Email): Promise<boolean> {
  if (!emailEnabled()) {
    logInstead(email);
    return false;
  }
  try {
    await post("/emails", toResend(email));
    return true;
  } catch (error) {
    console.error(`[email] Could not send "${email.subject}":`, error);
    return false;
  }
}

/**
 * Sends many emails in batches of 100, pausing between requests to stay under Resend's
 * rate limit. Returns how many were accepted.
 */
export async function sendEmails(emails: Email[]): Promise<number> {
  if (!emailEnabled()) {
    emails.slice(0, 3).forEach(logInstead);
    if (emails.length > 3) console.info(`[email] ...and ${emails.length - 3} more`);
    return 0;
  }
  let sent = 0;
  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);
    try {
      await post("/emails/batch", batch.map(toResend));
      sent += batch.length;
    } catch (error) {
      console.error(`[email] Batch ${i / BATCH_SIZE + 1} failed:`, error);
    }
    if (i + BATCH_SIZE < emails.length) await new Promise((r) => setTimeout(r, 600));
  }
  return sent;
}

import "server-only";
import { siteConfig } from "@/config/site";

/**
 * Email delivery over HTTP, through Brevo (https://developers.brevo.com) when
 * BREVO_API_KEY is set, otherwise Resend (RESEND_API_KEY). Without either nothing is
 * sent: in development the email is printed to the server log instead (links included),
 * so the flows can be tried locally.
 */

export type Email = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  headers?: Record<string, string>;
};

const provider = process.env.BREVO_API_KEY
  ? "brevo"
  : process.env.RESEND_API_KEY
    ? "resend"
    : undefined;

/** "Name <address>" or a bare address, as written in EMAIL_FROM. */
function parseFrom(value: string) {
  const match = value.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return match
    ? { name: match[1].replace(/^"|"$/g, "") || siteConfig.name, email: match[2].trim() }
    : { name: siteConfig.name, email: value.trim() };
}

export const emailConfig = {
  provider,
  /**
   * Sender, e.g. "Serge Alain Kamedjieu <news@your-domain.com>". With Brevo it must be
   * a sender (or domain) verified in Brevo; with Resend, a domain verified in Resend.
   */
  from: parseFrom(
    process.env.EMAIL_FROM ||
      (provider === "resend" ? "onboarding@resend.dev" : siteConfig.contactEmail),
  ),
  /** Where the author's notifications go. */
  authorEmail: process.env.AUTHOR_EMAIL || siteConfig.contactEmail,
};

export const emailEnabled = () => Boolean(provider);

/* ---------- Providers ---------- */

async function check(response: Response, name: string) {
  if (!response.ok) throw new Error(`${name} ${response.status}: ${await response.text()}`);
}

async function sendWithBrevo(email: Email) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY!,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: emailConfig.from,
      to: [{ email: email.to }],
      subject: email.subject,
      htmlContent: email.html,
      textContent: email.text,
      ...(email.replyTo ? { replyTo: { email: email.replyTo } } : {}),
      ...(email.headers ? { headers: email.headers } : {}),
    }),
  });
  await check(response, "Brevo");
}

async function sendWithResend(email: Email) {
  const { name, email: address } = emailConfig.from;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${name} <${address}>`,
      to: [email.to],
      subject: email.subject,
      html: email.html,
      text: email.text,
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
      ...(email.headers ? { headers: email.headers } : {}),
    }),
  });
  await check(response, "Resend");
}

function logInstead(email: Email) {
  if (process.env.NODE_ENV === "production") {
    console.warn(`[email] No BREVO_API_KEY; not sent: "${email.subject}" to ${email.to}`);
  } else {
    console.info(
      `\n[email] (not sent, no BREVO_API_KEY)\nTo: ${email.to}\nSubject: ${email.subject}\n\n${email.text}\n`,
    );
  }
}

/* ---------- Sending ---------- */

/** Sends one email. Returns false (and logs) instead of throwing when it fails. */
export async function sendEmail(email: Email): Promise<boolean> {
  if (!provider) {
    logInstead(email);
    return false;
  }
  try {
    await (provider === "brevo" ? sendWithBrevo(email) : sendWithResend(email));
    return true;
  } catch (error) {
    console.error(`[email] Could not send "${email.subject}" to ${email.to}:`, error);
    return false;
  }
}

/** Emails sent at the same time, kept low to stay under the providers' rate limits. */
const CONCURRENCY = 5;

/**
 * Sends many emails (one request each, a few at a time, with a short pause between
 * groups). Returns how many were accepted.
 */
export async function sendEmails(emails: Email[]): Promise<number> {
  if (!provider) {
    emails.slice(0, 3).forEach(logInstead);
    if (emails.length > 3) console.info(`[email] ...and ${emails.length - 3} more`);
    return 0;
  }
  let sent = 0;
  for (let i = 0; i < emails.length; i += CONCURRENCY) {
    const results = await Promise.all(emails.slice(i, i + CONCURRENCY).map(sendEmail));
    sent += results.filter(Boolean).length;
    if (i + CONCURRENCY < emails.length) await new Promise((r) => setTimeout(r, 300));
  }
  return sent;
}

import "server-only";
import { siteConfig } from "@/config/site";

/**
 * Shared look of every email: table layout and inline styles (what email clients
 * support), the site's royal blue, a white card on a light background, and a footer
 * with the reason for the email and, for newsletters, the unsubscribe link.
 */

export const colors = {
  brand: "#4169e1",
  brandStrong: "#2b4fc7",
  ink: "#0a0a0a",
  muted: "#5c5f66",
  line: "#e6e8ee",
  background: "#f3f6ff",
};

const font = "Helvetica, Arial, sans-serif";

/** Escapes text for HTML. Every value that isn't our own markup goes through this. */
export function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Absolute URL on the site, e.g. url("/en/articles/x"). */
export function url(path: string) {
  return `${siteConfig.url.replace(/\/$/, "")}${path}`;
}

/** Image URL usable in an email (data: images are blocked by most clients). */
export function emailImage(src?: string | null) {
  if (!src) return undefined;
  if (src.startsWith("https://")) return src;
  if (src.startsWith("/")) return url(src);
  return undefined;
}

export function heading(text: string) {
  return `<h1 style="margin:0 0 12px;font-family:${font};font-size:24px;line-height:1.25;font-weight:700;color:${colors.ink};">${esc(text)}</h1>`;
}

export function paragraph(text: string, style = "") {
  return `<p style="margin:0 0 16px;font-family:${font};font-size:16px;line-height:1.6;color:${colors.muted};${style}">${esc(text)}</p>`;
}

export function eyebrow(text: string) {
  return `<p style="margin:0 0 8px;font-family:${font};font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${colors.brandStrong};">${esc(text)}</p>`;
}

export function button(label: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;"><tr><td style="border-radius:12px;background:${colors.brand};">
<a href="${esc(href)}" style="display:inline-block;padding:14px 24px;font-family:${font};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;">${esc(label)}</a>
</td></tr></table>`;
}

export function image(src: string, alt: string, maxWidth = 520) {
  return `<img src="${esc(src)}" alt="${esc(alt)}" width="${maxWidth}" style="display:block;width:100%;max-width:${maxWidth}px;height:auto;margin:0 0 20px;border-radius:14px;border:0;" />`;
}

/** Label / value rows, for the author's notifications. */
export function details(rows: [string, string][]) {
  const cells = rows
    .map(
      ([label, value]) =>
        `<tr><td width="120" style="width:120px;padding:8px 12px 8px 0;font-family:${font};font-size:13px;color:${colors.muted};vertical-align:top;white-space:nowrap;">${esc(label)}</td><td style="padding:8px 0;font-family:${font};font-size:14px;color:${colors.ink};">${esc(value)}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 20px;border-top:1px solid ${colors.line};border-bottom:1px solid ${colors.line};">${cells}</table>`;
}

/** A block of text kept as written (line breaks included), e.g. a contact message. */
export function quote(text: string) {
  return `<div style="margin:0 0 20px;padding:16px 18px;border-left:3px solid ${colors.brand};background:${colors.background};border-radius:0 12px 12px 0;font-family:${font};font-size:15px;line-height:1.6;color:${colors.ink};white-space:pre-wrap;">${esc(text)}</div>`;
}

type LayoutOptions = {
  lang: string;
  /** Hidden line shown after the subject in the inbox list. */
  preview: string;
  body: string;
  /** Small print at the bottom: why they got this email. */
  footer: string;
  /** Adds an unsubscribe link to the footer (newsletter emails). */
  unsubscribe?: { label: string; href: string };
};

export function layout({ lang, preview, body, footer, unsubscribe }: LayoutOptions) {
  return `<!doctype html>
<html lang="${esc(lang)}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>${esc(siteConfig.name)}</title>
</head>
<body style="margin:0;padding:0;background:${colors.background};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.background};">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
    <tr><td style="padding:0 4px 20px;">
      <a href="${esc(url(`/${lang}`))}" style="text-decoration:none;">
        <span style="display:inline-block;width:36px;height:36px;line-height:36px;text-align:center;border-radius:10px;background:${colors.brand};font-family:${font};font-size:14px;font-weight:700;color:#ffffff;vertical-align:middle;">SK</span>
        <span style="display:inline-block;margin-left:10px;font-family:${font};font-size:16px;font-weight:700;color:${colors.ink};vertical-align:middle;">${esc(siteConfig.name)}</span>
      </a>
    </td></tr>
    <tr><td style="padding:32px 28px;background:#ffffff;border-radius:20px;border:1px solid ${colors.line};">
      ${body}
    </td></tr>
    <tr><td style="padding:20px 8px 0;font-family:${font};font-size:12px;line-height:1.6;color:${colors.muted};text-align:center;">
      ${esc(footer)}${unsubscribe ? `<br /><a href="${esc(unsubscribe.href)}" style="color:${colors.muted};text-decoration:underline;">${esc(unsubscribe.label)}</a>` : ""}
      <br />${esc(siteConfig.name)} · JAFAN Ministries · ${esc(siteConfig.location)}
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

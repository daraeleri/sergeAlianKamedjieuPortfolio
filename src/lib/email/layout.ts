import "server-only";
import { siteConfig } from "@/config/site";

/**
 * Building blocks of every email, following the classic newsletter anatomy: centered
 * logo, a featured block (image, headline, text, button), supporting cards that
 * alternate image and text, a promotional block, then a "stay connected" footer with
 * the address and the unsubscribe link. Tables and inline styles only, since that is
 * what email apps render reliably; a small media query stacks the cards on phones.
 */

export const colors = {
  brand: "#4169e1",
  brandStrong: "#2b4fc7",
  ink: "#0a0a0a",
  text: "#3f434a",
  muted: "#6b7079",
  line: "#e6e8ee",
  tint: "#f3f6ff",
  page: "#eef1f8",
};

const font = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const WIDTH = 600;
const INNER = 560;

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

/** The envelope illustration (PNG) used at the top of subscription emails. */
export const heroArt = () => url("/api/email/hero");

type Link = { label: string; href: string };

function buttonHtml({ label, href }: Link, variant: "brand" | "ink" = "brand", align = "center") {
  const background = variant === "brand" ? colors.brand : colors.ink;
  return `<table role="presentation" cellpadding="0" cellspacing="0" align="${align}" style="margin:${align === "center" ? "0 auto" : "0"};"><tr><td style="border-radius:10px;background:${background};">
<a href="${esc(href)}" style="display:inline-block;padding:13px 26px;font-family:${font};font-size:14px;font-weight:700;letter-spacing:0.4px;color:#ffffff;text-decoration:none;border-radius:10px;">${esc(label)}</a>
</td></tr></table>`;
}

/** Spacer row between sections. */
const gap = (height: number) =>
  `<tr><td height="${height}" style="height:${height}px;font-size:0;line-height:0;">&nbsp;</td></tr>`;

/* ---------- Sections ---------- */

type Featured = {
  /** Wide image at the top of the block, or the envelope illustration. */
  image?: { src: string; alt: string; width?: number; height?: number };
  /** Shown instead of an image when there is none (e.g. a themed article). */
  banner?: string;
  eyebrow?: string;
  title: string;
  text: string;
  cta?: Link;
  /** Small print under the button. */
  note?: string;
};

/** Featured block: image across the top, then a centered headline, text and button. */
export function featured({ image, banner, eyebrow, title, text, cta, note }: Featured) {
  const width = image?.width ?? INNER;
  const top = image
    ? `<tr><td align="center" style="padding:${width < INNER ? "28px 0 0" : "0"};">
<img src="${esc(image.src)}" alt="${esc(image.alt)}" width="${width}"${image.height ? ` height="${image.height}"` : ""} style="display:block;width:100%;max-width:${width}px;height:auto;border:0;${width < INNER ? "border-radius:8px;box-shadow:0 18px 30px -18px rgba(10,10,10,.45);" : "border-radius:14px 14px 0 0;"}" />
</td></tr>`
    : banner
      ? `<tr><td align="center" bgcolor="${colors.brand}" style="height:180px;padding:0 24px;border-radius:14px 14px 0 0;background:${colors.brand};font-family:${font};font-size:26px;font-weight:700;color:#ffffff;">${esc(banner)}</td></tr>`
      : "";
  return `<tr><td style="padding:0 20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.tint};border-radius:14px;">
${top}
<tr><td align="center" style="padding:30px 32px 34px;">
  ${eyebrow ? `<p style="margin:0 0 10px;font-family:${font};font-size:12px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${colors.brandStrong};">${esc(eyebrow)}</p>` : ""}
  <h1 style="margin:0 0 12px;font-family:${font};font-size:26px;line-height:1.25;font-weight:700;color:${colors.ink};">${esc(title)}</h1>
  <p style="margin:0 0 ${cta ? 24 : 0}px;font-family:${font};font-size:16px;line-height:1.65;color:${colors.text};">${esc(text)}</p>
  ${cta ? buttonHtml(cta) : ""}
  ${note ? `<p style="margin:20px 0 0;font-family:${font};font-size:13px;line-height:1.5;color:${colors.muted};">${esc(note)}</p>` : ""}
</td></tr>
</table>
</td></tr>`;
}

export type Card = {
  title: string;
  text: string;
  link: Link;
  /** Square image; without one, a colored tile with the first letter of the title. */
  image?: string;
};

function cardImage(card: Card, index: number) {
  if (card.image) {
    return `<img src="${esc(card.image)}" alt="" width="280" style="display:block;width:100%;max-width:280px;height:auto;border:0;" />`;
  }
  const background = index % 2 ? colors.ink : colors.brand;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" bgcolor="${background}" style="height:220px;background:${background};font-family:${font};font-size:64px;font-weight:700;color:rgba(255,255,255,.9);">${esc(card.title.trim().charAt(0).toUpperCase() || "·")}</td></tr></table>`;
}

/** Supporting content: cards alternating image left / image right, with a heading. */
export function supporting(heading: string, cards: Card[]) {
  if (!cards.length) return "";
  const rows = cards
    .map((card, i) => {
      const imageCell = `<td dir="ltr" class="stack" width="50%" valign="top" style="width:50%;background:${colors.tint};">${cardImage(card, i)}</td>`;
      const textCell = `<td dir="ltr" class="stack" width="50%" valign="middle" style="width:50%;padding:24px 22px;background:${colors.tint};">
<h3 style="margin:0 0 8px;font-family:${font};font-size:18px;line-height:1.3;font-weight:700;color:${colors.ink};">${esc(card.title)}</h3>
<p style="margin:0 0 14px;font-family:${font};font-size:14px;line-height:1.6;color:${colors.text};">${esc(card.text)}</p>
<a href="${esc(card.link.href)}" style="font-family:${font};font-size:13px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:${colors.ink};text-decoration:underline;">${esc(card.link.label)}</a>
</td>`;
      // The image always comes first in the source, so phones stack it on top; every
      // other row is flipped with dir="rtl" to put the image on the right on desktop.
      return `${i ? gap(14) : ""}<tr><td style="padding:0 20px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" dir="${i % 2 ? "rtl" : "ltr"}" style="border-radius:14px;overflow:hidden;"><tr>${imageCell}${textCell}</tr></table></td></tr>`;
    })
    .join("");
  return `<tr><td style="padding:0 20px 14px;font-family:${font};font-size:12px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${colors.muted};">${esc(heading)}</td></tr>${rows}`;
}

/** Promotional block: plain white, headline, text and a dark button. */
export function promo({ title, text, cta }: { title: string; text: string; cta: Link }) {
  return `<tr><td style="padding:6px 40px 4px;">
<h2 style="margin:0 0 10px;font-family:${font};font-size:20px;line-height:1.3;font-weight:700;color:${colors.ink};">${esc(title)}</h2>
<p style="margin:0 0 20px;font-family:${font};font-size:15px;line-height:1.65;color:${colors.text};">${esc(text)}</p>
${buttonHtml(cta, "ink", "left")}
</td></tr>`;
}

/** Plain content panel for notifications: heading, then any blocks below. */
export function panel(title: string, blocks: string[]) {
  return `<tr><td style="padding:0 20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.tint};border-radius:14px;">
<tr><td style="padding:30px 30px 32px;">
<h1 style="margin:0 0 12px;font-family:${font};font-size:24px;line-height:1.25;font-weight:700;color:${colors.ink};">${esc(title)}</h1>
${blocks.join("\n")}
</td></tr></table>
</td></tr>`;
}

export function paragraph(text: string, style = "") {
  return `<p style="margin:0 0 18px;font-family:${font};font-size:15px;line-height:1.65;color:${colors.text};${style}">${esc(text)}</p>`;
}

export function button(link: Link) {
  return buttonHtml(link, "brand", "left");
}

/** Label / value rows, for the author's notifications. */
export function details(rows: [string, string][]) {
  const cells = rows
    .map(
      ([label, value]) =>
        `<tr><td width="120" style="width:120px;padding:9px 12px 9px 0;border-top:1px solid ${colors.line};font-family:${font};font-size:13px;color:${colors.muted};vertical-align:top;">${esc(label)}</td><td style="padding:9px 0;border-top:1px solid ${colors.line};font-family:${font};font-size:14px;color:${colors.ink};">${esc(value)}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 20px;border-bottom:1px solid ${colors.line};">${cells}</table>`;
}

/** A block of text kept as written (line breaks included), e.g. a contact message. */
export function quote(text: string) {
  return `<div style="margin:0 0 22px;padding:16px 18px;border-left:3px solid ${colors.brand};background:#ffffff;border-radius:0 10px 10px 0;font-family:${font};font-size:15px;line-height:1.6;color:${colors.ink};white-space:pre-wrap;">${esc(text)}</div>`;
}

/* ---------- Page ---------- */

type FooterCopy = {
  stayConnected: string;
  links: Link[];
  /** Why they got this email. */
  reason: string;
  unsubscribe?: Link;
};

type LayoutOptions = {
  lang: string;
  /** Hidden line shown after the subject in the inbox list. */
  preview: string;
  /** Section rows from featured(), supporting(), promo() or panel(). */
  sections: string[];
  footer: FooterCopy;
};

export function layout({ lang, preview, sections, footer }: LayoutOptions) {
  const links = footer.links
    .map(
      (link) =>
        `<a href="${esc(link.href)}" style="font-family:${font};font-size:13px;font-weight:600;color:${colors.ink};text-decoration:none;">${esc(link.label)}</a>`,
    )
    .join(`<span style="color:${colors.line};">&nbsp;&nbsp;|&nbsp;&nbsp;</span>`);

  return `<!doctype html>
<html lang="${esc(lang)}" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${esc(siteConfig.name)}</title>
<style>
  @media (max-width: 620px) {
    .stack { display: block !important; width: 100% !important; box-sizing: border-box !important; }
    .pad { padding-left: 12px !important; padding-right: 12px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${colors.page};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preview)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.page};">
<tr><td class="pad" align="center" style="padding:28px 16px;">
  <table role="presentation" width="${WIDTH}" cellpadding="0" cellspacing="0" style="width:100%;max-width:${WIDTH}px;background:#ffffff;border-radius:18px;">
    <!-- Logo -->
    <tr><td align="center" style="padding:26px 20px 22px;">
      <a href="${esc(url(`/${lang}`))}" style="text-decoration:none;">
        <span style="display:inline-block;width:34px;height:34px;line-height:34px;text-align:center;border-radius:9px;background:${colors.brand};font-family:${font};font-size:13px;font-weight:700;color:#ffffff;vertical-align:middle;">SK</span>
        <span style="display:inline-block;margin-left:10px;font-family:${font};font-size:17px;font-weight:700;letter-spacing:-0.2px;color:${colors.ink};vertical-align:middle;">${esc(siteConfig.name)}</span>
      </a>
    </td></tr>
    ${sections.join(gap(26))}
    ${gap(30)}
    <!-- Stay connected -->
    <tr><td style="padding:0 40px;"><div style="height:3px;line-height:3px;font-size:0;background:${colors.ink};border-radius:2px;">&nbsp;</div></td></tr>
    <tr><td align="center" style="padding:24px 30px 30px;">
      <p style="margin:0 0 12px;font-family:${font};font-size:12px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${colors.ink};">${esc(footer.stayConnected)}</p>
      <p style="margin:0 0 16px;">${links}</p>
      <p style="margin:0 0 6px;font-family:${font};font-size:12px;line-height:1.6;color:${colors.muted};">${esc(siteConfig.name)} · JAFAN Ministries · ${esc(siteConfig.location)}</p>
      <p style="margin:0;font-family:${font};font-size:12px;line-height:1.6;color:${colors.muted};">${esc(footer.reason)}${footer.unsubscribe ? ` <a href="${esc(footer.unsubscribe.href)}" style="color:${colors.muted};text-decoration:underline;">${esc(footer.unsubscribe.label)}</a>` : ""}</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

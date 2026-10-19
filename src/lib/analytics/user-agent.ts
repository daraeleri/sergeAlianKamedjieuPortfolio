/** Rough browser, OS and device type from a user-agent string (no dependency). */
export function parseUserAgent(ua: string) {
  const browser = /SamsungBrowser/.test(ua)
    ? "Samsung Internet"
    : /OPR\/|Opera/.test(ua)
      ? "Opera"
      : /Edg\//.test(ua)
        ? "Edge"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : /Chrome\/|CriOS/.test(ua)
            ? "Chrome"
            : /Safari\//.test(ua)
              ? "Safari"
              : "Other";
  const os = /Android/.test(ua)
    ? "Android"
    : /iPhone|iPad|iPod/.test(ua)
      ? "iOS"
      : /Windows/.test(ua)
        ? "Windows"
        : /Mac OS X|Macintosh/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "Other";
  const device =
    /iPad|Tablet/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua))
      ? "tablet"
      : /Mobi|iPhone|Android/.test(ua)
        ? "mobile"
        : "desktop";
  return { browser, os, device };
}

export function isBot(ua: string) {
  return (
    !ua ||
    /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|headless|lighthouse/i.test(ua)
  );
}

/** Groups a referrer URL into a source shown in the dashboard. */
export function referrerSource(referrer: string | undefined, host: string | null) {
  if (!referrer) return "direct";
  let hostname: string;
  try {
    hostname = new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "direct";
  }
  if (host && hostname === host.replace(/^www\./, "").split(":")[0]) return "internal";
  if (/whatsapp|wa\.me/.test(hostname)) return "whatsapp";
  if (/facebook|fb\.com|fb\.me/.test(hostname)) return "facebook";
  if (/(^|\.)google\./.test(hostname)) return "google";
  if (/youtube|youtu\.be/.test(hostname)) return "youtube";
  if (/instagram/.test(hostname)) return "instagram";
  if (/linkedin|lnkd\.in/.test(hostname)) return "linkedin";
  return "other";
}

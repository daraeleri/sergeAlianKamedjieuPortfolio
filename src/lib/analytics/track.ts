/** Browser side of analytics: sends events to /api/track and never throws. */

type TrackEvent =
  | { type: "view"; path: string; referrer?: string; locale?: string; articleId?: string }
  | { type: "leave"; id: string; duration: number }
  | { type: "read"; path: string; articleId?: string }
  | { type: "share"; path: string; articleId?: string; channel: ShareChannel };

type ShareChannel = "whatsapp" | "copy" | "email" | "native";

/** Analytics run in production; set NEXT_PUBLIC_TRACK_IN_DEV=1 to test them locally. */
export const trackingEnabled =
  process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_TRACK_IN_DEV === "1";

/** Article slug from a path like "/fr/articles/leadership-serviteur". */
export function articleIdFromPath(path: string) {
  return /^\/(?:en|fr)\/articles\/([^/?#]+)/.exec(path)?.[1];
}

/** Sends a view and resolves to its id (used to report the time spent on the page). */
export async function trackView(event: Extract<TrackEvent, { type: "view" }>) {
  if (!trackingEnabled) return undefined;
  try {
    const response = await fetch("/api/track", {
      method: "POST",
      body: JSON.stringify(event),
      keepalive: true,
    });
    if (response.status !== 200) return undefined;
    return ((await response.json()) as { id?: string }).id;
  } catch {
    return undefined;
  }
}

/** Sends an event that needs no answer; survives the page closing. */
export function track(event: Exclude<TrackEvent, { type: "view" }>) {
  if (!trackingEnabled) return;
  const body = JSON.stringify(event);
  if (navigator.sendBeacon?.("/api/track", body)) return;
  fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => undefined);
}

/** Records a share of the current page. */
export function trackShare(channel: ShareChannel) {
  const path = window.location.pathname;
  track({ type: "share", path, articleId: articleIdFromPath(path), channel });
}

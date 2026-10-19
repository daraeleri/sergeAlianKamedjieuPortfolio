"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { articleIdFromPath, track, trackView } from "@/lib/analytics/track";

/**
 * Records each page view of the public site and how long the visitor stayed on it.
 * The referrer is only sent with the first page of a visit; later pages are in-site
 * navigations.
 */
export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const started = Date.now();
    let viewId: string | undefined;
    let left = false;

    const firstPage = !readFlag();
    void trackView({
      type: "view",
      path: pathname,
      locale: pathname.split("/")[1],
      articleId: articleIdFromPath(pathname),
      referrer: firstPage ? document.referrer || undefined : undefined,
    }).then((id) => (viewId = id));

    const leave = () => {
      if (left || !viewId) return;
      left = true;
      track({ type: "leave", id: viewId, duration: Math.round((Date.now() - started) / 1000) });
    };
    const onHide = () => document.visibilityState === "hidden" && leave();
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", leave);
    return () => {
      leave();
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", leave);
    };
  }, [pathname]);

  return null;
}

/** Marks the visit as started for this tab; true if it already was. */
function readFlag() {
  try {
    const seen = window.sessionStorage.getItem("sak:visit") === "1";
    window.sessionStorage.setItem("sak:visit", "1");
    return seen;
  } catch {
    return false;
  }
}

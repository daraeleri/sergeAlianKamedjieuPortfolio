"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics/track";

/** Invisible marker at the end of an article: counts a read when it scrolls into view. */
export function ReadTracker({ articleId }: { articleId: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      track({ type: "read", path: window.location.pathname, articleId });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [articleId]);

  return <span ref={ref} aria-hidden />;
}

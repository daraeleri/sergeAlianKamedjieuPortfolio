"use client";

import { ReactLenis } from "lenis/react";
import { useSyncExternalStore } from "react";
import "lenis/dist/lenis.css";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Site-wide Lenis smooth scrolling on the window. Skipped when the visitor prefers
 * reduced motion (and during server rendering), leaving native scrolling in place.
 * Lenis drives the real window scroll, so CSS scroll-driven animations keep working.
 */
export function SmoothScroll() {
  const reducedMotion = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true,
  );

  if (reducedMotion) return null;

  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.1,
        // Smoothly scroll to in-page anchors such as "#about".
        anchors: true,
      }}
    />
  );
}

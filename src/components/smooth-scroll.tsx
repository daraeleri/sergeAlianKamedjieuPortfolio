"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Site-wide Lenis smooth scrolling on the window, driven by GSAP's ticker so Lenis and
 * ScrollTrigger animations update on the same frame. Skipped when the visitor prefers
 * reduced motion (and during server rendering), leaving native scrolling in place.
 */
export function SmoothScroll() {
  const lenisRef = useRef<LenisRef>(null);
  const reducedMotion = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true,
  );

  // Keep ScrollTrigger in step with every Lenis scroll update.
  useLenis(ScrollTrigger.update);

  useEffect(() => {
    if (reducedMotion) return;
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        autoRaf: false,
        lerp: 0.1,
        // Smoothly scroll to in-page anchors such as "#about".
        anchors: true,
      }}
    />
  );
}

"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, useRef } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ScrollMarqueeProps = {
  items: string[];
  className?: string;
};

/**
 * Tilted royal-blue band of large words that loops horizontally. It speeds up with
 * scroll velocity and runs backwards while the page scrolls up. Static for visitors
 * who prefer reduced motion.
 */
export function ScrollMarquee({ items, className }: ScrollMarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The track holds the word list twice, so moving it by -50% loops seamlessly.
        const loop = gsap.to("[data-marquee-track]", {
          xPercent: -50,
          duration: 28,
          ease: "none",
          repeat: -1,
        });
        // Start deep into the repeats so playing backwards never reaches the beginning.
        loop.totalTime(loop.duration() * 500);

        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 350, 5);
            gsap.to(loop, {
              timeScale: self.direction * boost,
              duration: 0.25,
              overwrite: true,
              onComplete: () => {
                gsap.to(loop, { timeScale: self.direction, duration: 1, ease: "power2.out" });
              },
            });
          },
        });
      });
    },
    { scope: rootRef },
  );

  const words = (copy: number) =>
    items.map((item) => (
      <Fragment key={`${copy}-${item}`}>
        <span className="px-6 sm:px-10">{item}</span>
        <span className="text-[0.5em] text-white/60">✦</span>
      </Fragment>
    ));

  return (
    <div ref={rootRef} className={cn("relative py-6", className)}>
      {/* Readable once for assistive technology; the moving band is decorative. */}
      <p className="sr-only">{items.join(", ")}</p>
      <div
        aria-hidden
        className="-mx-[5%] -rotate-2 overflow-hidden bg-brand py-5 text-white shadow-[0_20px_50px_-25px] shadow-brand sm:py-7"
      >
        <div
          data-marquee-track
          className="flex w-max items-center font-heading text-5xl font-bold tracking-tight whitespace-nowrap sm:text-7xl"
        >
          {words(0)}
          {words(1)}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, useRef } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ScrollMarqueeProps = {
  items: string[];
  /** Small caption above the strip, e.g. "Courses, seminars, lectures and more". */
  label?: string;
  className?: string;
};

/**
 * Straight strip of large words that loops horizontally, with faded edges (BeeToGreen's
 * partner-logo strip). It gently speeds up with scrolling and runs backwards while the
 * page scrolls up. Static for visitors who prefer reduced motion.
 */
export function ScrollMarquee({ items, label, className }: ScrollMarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The track holds the word list twice, so moving it by -50% loops seamlessly.
        const loop = gsap.to("[data-marquee-track]", {
          xPercent: -50,
          duration: 32,
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
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 600, 2.5);
            gsap.to(loop, {
              timeScale: self.direction * boost,
              duration: 0.3,
              overwrite: true,
              onComplete: () => {
                gsap.to(loop, { timeScale: self.direction, duration: 1.2, ease: "power2.out" });
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
        <span className="size-2.5 shrink-0 rounded-full bg-brand sm:size-3" />
      </Fragment>
    ));

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {label ? <p className="text-center text-sm font-medium text-black/50">{label}</p> : null}
      {/* Readable once for assistive technology; the moving strip is decorative. */}
      <p className="sr-only">{items.join(", ")}</p>
      <div
        aria-hidden
        className="mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      >
        <div
          data-marquee-track
          className="flex w-max items-center font-heading text-4xl font-bold tracking-tight whitespace-nowrap text-ink/85 sm:text-6xl"
        >
          {words(0)}
          {words(1)}
        </div>
      </div>
    </div>
  );
}

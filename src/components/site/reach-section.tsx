"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, useRef } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Bafoussam's position on /svg/world-map.svg, in % of the map (from the map generator). */
const PIN = { left: 49.9, top: 67.2 };
/** viewBox width / height of /svg/world-map.svg. */
const MAP_ASPECT = "1009.7/666";

/** Renders "**bold**" segments of a dictionary string as <strong>. */
function rich(text: string) {
  return text.split("**").map((part, i) =>
    i % 2 ? (
      <strong key={i} className="font-semibold text-ink">
        {part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/**
 * Small "hype" section before Contact (no call to action): a light card with the world map
 * breaking out of its top-left corner, Cameroon highlighted with a pulsing pin on
 * Bafoussam and a royal-blue swoosh looping around Africa, and a short statement on the right.
 */
export function ReachSection({ copy }: { copy: Dictionary["reach"] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const reverse = "play none none reverse";
        const trigger = { trigger: sectionRef.current, start: "top 75%", toggleActions: reverse };
        gsap.from("[data-reach-map]", {
          y: 60,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: trigger,
        });
        gsap.fromTo(
          "[data-reach-swoosh]",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              end: "center 45%",
              scrub: true,
            },
          },
        );
        gsap.from("[data-reach-pin]", {
          scale: 0,
          duration: 0.6,
          delay: 0.5,
          ease: "back.out(3)",
          scrollTrigger: trigger,
        });
        gsap.from("[data-reach-text] > *", {
          y: 30,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: trigger,
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="bg-white px-5 pt-28 pb-16 sm:px-8 sm:pt-36 sm:pb-24">
      <div className="relative mx-auto flex max-w-6xl flex-col rounded-[2rem] bg-[#ebf0ff] ring-1 ring-brand/10 lg:grid lg:min-h-[28rem] lg:grid-cols-[1.25fr_1fr]">
        {/* Map: above the text on small screens, breaking out of the card top-left on desktop. */}
        <div className="-mt-16 px-3 sm:-mt-20 sm:px-6 lg:absolute lg:-top-20 lg:left-2 lg:mt-0 lg:w-[52%] lg:px-0">
          <div data-reach-map className="relative w-full" style={{ aspectRatio: MAP_ASPECT }}>
            {/* Decorative map; the text says where he is based. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, no optimisation needed */}
            <img src="/svg/world-map.svg" alt="" aria-hidden className="size-full" />

            {/* Royal-blue swoosh drawn over the map as you scroll */}
            <svg
              aria-hidden
              viewBox="0 0 450 300"
              preserveAspectRatio="none"
              className="absolute inset-0 size-full overflow-visible"
            >
              <path
                data-reach-swoosh
                d="M-10 70C110 40 215 105 238 185c16 58-30 102-78 92-50-10-54-76-4-108 55-35 150-40 250-5"
                fill="none"
                stroke="var(--brand)"
                strokeWidth="18"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                className="opacity-90"
              />
            </svg>

            {/* Bafoussam pin: the outer span marks the point; margins centre the dot on it
                (GSAP animates the inner span, so its transform never fights the positioning). */}
            <span className="absolute z-10" style={{ left: `${PIN.left}%`, top: `${PIN.top}%` }}>
              <span data-reach-pin className="-mt-2 -ml-2 flex origin-[0.5rem_0.5rem] items-center">
                <span className="relative flex size-4">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/80 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-4 rounded-full border-[3px] border-white bg-brand" />
                </span>
                <span className="ml-2 rounded-full bg-white px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-ink shadow-md">
                  {copy.pin}
                </span>
              </span>
            </span>
          </div>
        </div>

        {/* Statement (no call to action) */}
        <div
          data-reach-text
          className="px-7 pt-8 pb-10 sm:px-12 sm:pb-14 lg:col-start-2 lg:py-20 lg:pr-14 lg:pl-4"
        >
          <p className="text-xs font-semibold tracking-[0.2em] text-brand-strong uppercase">
            {copy.eyebrow}
          </p>
          <h2 className="mt-4 font-heading text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl">
            {copy.headingLead} <span className="text-brand">{copy.headingHighlight}</span>
          </h2>
          <p className="mt-6 leading-relaxed text-black/65">{rich(copy.body)}</p>
          <p className="mt-5 text-sm text-black/55">{rich(copy.meta)}</p>
        </div>
      </div>
    </section>
  );
}

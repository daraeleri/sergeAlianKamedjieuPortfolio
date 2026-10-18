"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, useRef } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** viewBox of /svg/world-map.svg (Mercator world map). */
const MAP_W = 1009.7;
const MAP_H = 666;

/** Cameroon on the map, where the evangelism lines start (map units). */
const ORIGIN = { x: 510, y: 447 };

/** One point per continent the lines reach (map units, projected from lon/lat). */
const TARGETS = [
  { x: 194, y: 333 }, // North America
  { x: 312, y: 497 }, // South America
  { x: 509, y: 301 }, // Europe
  { x: 742, y: 358 }, // Asia
  { x: 851, y: 535 }, // Oceania
  { x: 545, y: 535 }, // Southern Africa
];

/** Curved arc from Cameroon to a target, bowing upwards like a flight path. */
function arcPath(to: { x: number; y: number }) {
  const dist = Math.hypot(to.x - ORIGIN.x, to.y - ORIGIN.y);
  const cx = (ORIGIN.x + to.x) / 2;
  const cy = Math.min(ORIGIN.y, to.y) - dist * 0.35;
  return `M${ORIGIN.x} ${ORIGIN.y} Q${Math.round(cx)} ${Math.round(cy)} ${to.x} ${to.y}`;
}

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
 * breaking out of its top and left edges, Cameroon highlighted, and evangelism lines arcing
 * from Cameroon to every continent ("from Cameroon to the world"), with a royal-blue coil
 * behind the map and a short statement on the right.
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
        // Lines leave Cameroon one after another, then each continent dot pops in.
        const arcs = gsap.timeline({ scrollTrigger: { ...trigger, start: "top 65%" } });
        arcs
          .from("[data-reach-origin]", { scale: 0, duration: 0.5, ease: "back.out(3)" })
          .fromTo(
            "[data-reach-arc]",
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.9, stagger: 0.15, ease: "power2.inOut" },
            "-=0.1",
          )
          .from(
            "[data-reach-dot]",
            {
              scale: 0,
              transformOrigin: "50% 50%",
              duration: 0.4,
              stagger: 0.15,
              ease: "back.out(3)",
            },
            "<0.6",
          );
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
    <section
      ref={sectionRef}
      className="overflow-x-clip bg-white px-5 pt-28 pb-16 sm:px-8 sm:pt-36 sm:pb-24"
    >
      <div className="relative mx-auto flex max-w-6xl flex-col rounded-[2rem] bg-[#ebf0ff] ring-1 ring-brand/10 lg:grid lg:min-h-[28rem] lg:grid-cols-[1.25fr_1fr]">
        {/* Map: above the text on small screens; on desktop it breaks out of the card's
            top and left edges. Layers: coil (back), map, arcs, origin glow (front). */}
        <div className="-mt-16 -ml-10 sm:-mt-20 sm:-ml-14 lg:absolute lg:-top-20 lg:-left-20 lg:mt-0 lg:ml-0 lg:w-[60%]">
          <div
            data-reach-map
            className="relative w-full"
            style={{ aspectRatio: `${MAP_W}/${MAP_H}` }}
          >
            {/* Royal-blue coil behind the map, drawn as you scroll */}
            <svg
              aria-hidden
              viewBox="0 0 450 300"
              preserveAspectRatio="none"
              className="absolute inset-0 z-0 size-full overflow-visible"
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

            {/* Decorative map; the text says where the ministry is based. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, no optimisation needed */}
            <img src="/svg/world-map.svg" alt="" aria-hidden className="relative z-10 size-full" />

            {/* Evangelism lines from Cameroon to every continent */}
            <svg
              aria-hidden
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              className="absolute inset-0 z-20 size-full overflow-visible"
            >
              {TARGETS.map((target) => (
                <path
                  key={`arc-${target.x}-${target.y}`}
                  data-reach-arc
                  d={arcPath(target)}
                  fill="none"
                  stroke="#9db4ff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1"
                />
              ))}
              {TARGETS.map((target) => (
                <circle
                  key={`dot-${target.x}-${target.y}`}
                  data-reach-dot
                  cx={target.x}
                  cy={target.y}
                  r="7"
                  fill="var(--brand)"
                  stroke="white"
                  strokeWidth="3"
                />
              ))}
            </svg>

            {/* Glowing origin on Cameroon (no label) */}
            <span
              className="absolute z-30"
              style={{
                left: `${(ORIGIN.x / MAP_W) * 100}%`,
                top: `${(ORIGIN.y / MAP_H) * 100}%`,
              }}
            >
              <span data-reach-origin className="relative -mt-2 -ml-2 flex size-4 origin-center">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-soft motion-reduce:animate-none" />
                <span className="relative inline-flex size-4 rounded-full border-[3px] border-white bg-brand" />
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

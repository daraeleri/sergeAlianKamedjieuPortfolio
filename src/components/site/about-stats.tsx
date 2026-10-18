"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type Stat = { value: number; label: string; detail: string };

type AboutStatsProps = {
  stats: Stat[];
  label: string;
};

/**
 * BeeToGreen-style row of big figures under the About card. Numbers count up when the
 * row scrolls into view (and back down when scrolling up past it). The real value is
 * rendered on the server, so it is correct without JavaScript or with reduced motion.
 */
export function AboutStats({ stats, label }: AboutStatsProps) {
  const rootRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count);
          // Years count up from a few decades earlier rather than from zero.
          const counter = { value: end > 1000 ? end - 30 : 0 };
          gsap.to(counter, {
            value: end,
            duration: 1.6,
            ease: "power2.out",
            snap: { value: 1 },
            onUpdate: () => {
              el.textContent = String(counter.value);
            },
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        });
        gsap.from("[data-stat]", {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <ul
      ref={rootRef}
      aria-label={label}
      className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
    >
      {stats.map((stat, i) => (
        <li
          key={stat.label}
          data-stat
          className={cn(
            "rounded-[1.75rem] p-6 sm:p-7",
            i === 0 ? "bg-brand text-white" : "bg-brand-tint text-ink",
          )}
        >
          <p
            className={cn(
              "font-heading text-5xl leading-none font-bold tracking-tight tabular-nums sm:text-6xl",
              i === 0 ? "text-white" : "text-brand",
            )}
          >
            <span data-count={stat.value}>{stat.value}</span>
          </p>
          <p className="mt-4 font-heading text-lg font-semibold tracking-tight">{stat.label}</p>
          <p className={cn("mt-1 text-sm", i === 0 ? "text-white/75" : "text-black/55")}>
            {stat.detail}
          </p>
        </li>
      ))}
    </ul>
  );
}

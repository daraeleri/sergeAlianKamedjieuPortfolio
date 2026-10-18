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
 * Light row of key figures under the About card, split by hairlines. Numbers count up when the
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
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
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
      className="mt-10 grid grid-cols-2 gap-y-8 border-t border-black/10 pt-8 sm:mt-12 lg:grid-cols-4"
    >
      {stats.map((stat, i) => (
        <li
          key={stat.label}
          data-stat
          className={cn(
            "pr-4",
            i % 2 && "border-l border-black/10 pl-5",
            i > 0 && "lg:border-l lg:border-black/10 lg:pl-6",
          )}
        >
          <p className="font-heading text-4xl leading-none font-semibold tracking-tight tabular-nums sm:text-5xl">
            <span data-count={stat.value}>{stat.value}</span>
            {i === 0 ? <span className="text-brand">+</span> : null}
          </p>
          <p className="mt-3 text-sm font-medium">{stat.label}</p>
          <p className="mt-0.5 text-[0.8rem] leading-snug text-black/50">{stat.detail}</p>
        </li>
      ))}
    </ul>
  );
}

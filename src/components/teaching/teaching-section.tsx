"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { Route } from "next";
import Link from "next/link";
import { useRef, useState } from "react";
import { DisciplineIcon } from "@/components/teaching/discipline-icon";
import { ScrollMarquee } from "@/components/ui/scroll-marquee";
import { SectionLabel } from "@/components/ui/section-label";
import type { Discipline } from "@/content/teaching";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** A discipline with its text already resolved for the current locale. */
export type LocalizedDiscipline = Pick<Discipline, "slug" | "icon"> & {
  title: string;
  description: string;
  topics: string[];
};

type TeachingSectionProps = {
  copy: Dictionary["teaching"];
  disciplines: LocalizedDiscipline[];
  contactHref: Route;
};

/**
 * Home "Teaching" section (United Carriers style): on desktop a royal-blue card stays
 * pinned beside the list of disciplines and switches to whichever one is in the middle
 * of the screen. Ends with a marquee of teaching formats that reacts to scrolling.
 */
export function TeachingSection({ copy, disciplines, contactHref }: TeachingSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const count = String(disciplines.length).padStart(2, "0");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: the row crossing the middle of the screen drives the pinned card.
      mm.add("(min-width: 1024px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-discipline-row]").forEach((row, i) => {
          ScrollTrigger.create({
            trigger: row,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && setActive(i),
          });
        });
        gsap.fromTo(
          "[data-discipline-progress]",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-discipline-list]",
              start: "top 55%",
              end: "bottom 55%",
              scrub: true,
            },
          },
        );
      });

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-rings]", {
          rotate: 140,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-discipline-list]",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Heading lines rise out of a mask, one after another.
        const split = SplitText.create("[data-teaching-heading]", { type: "lines", mask: "lines" });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: "[data-teaching-heading]",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
        gsap.from("[data-discipline-row]", {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: "[data-discipline-list]",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
        return () => split.revert();
      });
    },
    { scope: sectionRef },
  );

  const current = disciplines[active];

  return (
    <section
      ref={sectionRef}
      id="teaching"
      className="overflow-x-clip bg-white pt-20 pb-16 text-ink sm:pt-28 sm:pb-24 lg:pt-36"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionLabel label={copy.label} index="03" />

        <div className="mt-14 grid gap-8 sm:mt-20 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <h2
            data-teaching-heading
            className="font-heading text-[2.6rem] leading-[1] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            {copy.headingLead} <span className="text-brand">{copy.headingHighlight}</span>
          </h2>
          <div className="max-w-md space-y-6 lg:justify-self-end lg:pb-2">
            <p className="text-lg leading-relaxed text-black/60">{copy.intro}</p>
            <Link
              href={contactHref}
              className="group inline-flex items-center gap-3 rounded-md bg-ink px-5 py-3 font-mono text-xs tracking-[0.16em] text-white uppercase transition-colors hover:bg-brand"
            >
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                ↳
              </span>
              {copy.cta}
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-16 sm:mt-24 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          {/* Pinned card (desktop only) */}
          {current ? (
            <div
              aria-hidden
              className="relative hidden overflow-hidden rounded-[2.5rem] bg-brand p-10 text-white lg:sticky lg:top-28 lg:flex lg:h-[min(36rem,calc(100svh-9rem))] lg:flex-col lg:justify-between lg:self-start"
            >
              <Rings />
              <div className="relative flex items-center justify-between font-mono text-xs tracking-[0.16em] uppercase">
                <span className="text-white/70">{copy.disciplineLabel}</span>
                <span>
                  <span key={active} className="inline-block animate-fade-up">
                    {String(active + 1).padStart(2, "0")}
                  </span>{" "}
                  <span className="text-white/50">/ {count}</span>
                </span>
              </div>

              <div className="relative grid place-items-center">
                {disciplines.map((d, i) => (
                  <DisciplineIcon
                    key={d.slug}
                    name={d.icon}
                    className={cn(
                      "col-start-1 row-start-1 size-36 transition-all duration-700 ease-out xl:size-44",
                      i === active
                        ? "scale-100 rotate-0 opacity-100"
                        : "scale-75 -rotate-12 opacity-0",
                    )}
                  />
                ))}
              </div>

              <div className="relative">
                <p
                  key={active}
                  className="animate-fade-up font-heading text-4xl leading-none font-bold tracking-tight xl:text-5xl"
                >
                  {current.title}
                </p>
                <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/20">
                  <div
                    data-discipline-progress
                    className="h-full origin-left rounded-full bg-white"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {/* Discipline list */}
          <ol
            data-discipline-list
            aria-label={copy.disciplinesLabel}
            className="border-b border-black/10"
          >
            {disciplines.map((d, i) => (
              <li
                key={d.slug}
                data-discipline-row
                className={cn(
                  "relative border-t border-black/10 py-10 transition-opacity duration-500 lg:flex lg:min-h-[50vh] lg:flex-col lg:justify-center",
                  i === active ? "lg:opacity-100" : "lg:opacity-25",
                )}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs tracking-[0.16em] text-black/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <DisciplineIcon name={d.icon} className="size-9 text-brand lg:hidden" />
                </div>
                <h3 className="mt-5 font-heading text-3xl leading-tight font-bold tracking-tight sm:text-4xl xl:text-5xl">
                  {d.title}
                </h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-black/60">
                  {d.description}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {d.topics.map((topic) => (
                    <li
                      key={topic}
                      className="rounded-full border border-black/15 px-3 py-1 font-mono text-[0.65rem] tracking-[0.12em] text-black/70 uppercase"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <ScrollMarquee items={copy.formats} className="mt-24 sm:mt-32" />
    </section>
  );
}

/** Concentric dashed rings behind the icon; rotated by scroll. */
function Rings() {
  return (
    <svg
      data-rings
      viewBox="0 0 400 400"
      fill="none"
      className="pointer-events-none absolute top-1/2 left-1/2 size-[130%] -translate-x-1/2 -translate-y-1/2 text-white/15"
    >
      {[80, 130, 180].map((r, i) => (
        <circle
          key={r}
          cx="200"
          cy="200"
          r={r}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray={i === 1 ? "2 10" : "60 14"}
        />
      ))}
    </svg>
  );
}

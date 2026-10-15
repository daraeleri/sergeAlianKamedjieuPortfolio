"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useRef } from "react";
import { DisciplineIcon } from "@/components/teaching/discipline-icon";
import { ScrollMarquee } from "@/components/ui/scroll-marquee";
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
 * Home "Teaching" section in the BeeToGreen style: a rounded light-blue panel with a big
 * centred heading, a grid of chunky discipline cards (the first one royal blue) and a
 * strip of teaching formats.
 */
export function TeachingSection({ copy, disciplines, contactHref }: TeachingSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
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
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
        gsap.from("[data-teaching-intro]", {
          y: 30,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-teaching-heading]",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
        // Cards pop up one after another, with a little overshoot.
        gsap.from("[data-discipline-card]", {
          y: 80,
          opacity: 0,
          scale: 0.94,
          duration: 0.9,
          stagger: 0.1,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: "[data-discipline-grid]",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
        return () => split.revert();
      });
    },
    { scope: sectionRef },
  );

  const [featured, ...others] = disciplines;

  return (
    <section ref={sectionRef} id="teaching" className="bg-white px-2 pb-2 sm:px-4 sm:pb-4">
      <div className="overflow-hidden rounded-[2rem] bg-brand-tint py-20 text-ink sm:rounded-[3rem] sm:py-28 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Header */}
          <div className="mx-auto max-w-4xl text-center">
            <p
              data-teaching-intro
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-medium tracking-wide text-black/70 shadow-sm sm:text-sm"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-brand" />
              {copy.label}
            </p>
            <h2
              data-teaching-heading
              className="mt-6 font-heading text-[2.4rem] leading-[1.02] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl"
            >
              {copy.headingLead} <span className="text-brand">{copy.headingHighlight}</span>
            </h2>
            <p
              data-teaching-intro
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-black/65 sm:text-lg"
            >
              {copy.intro}
            </p>
            <div data-teaching-intro className="mt-8">
              <Link
                href={contactHref}
                className="group inline-flex items-center gap-3 rounded-xl bg-brand px-6 py-3.5 font-medium text-white shadow-[0_10px_30px_-10px] shadow-brand transition-colors hover:bg-brand-strong"
              >
                {copy.cta}
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* Discipline cards */}
          <ul
            data-discipline-grid
            aria-label={copy.disciplinesLabel}
            className="mt-16 grid gap-4 sm:mt-20 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2"
          >
            {featured ? (
              <li data-discipline-card className="md:col-span-2 lg:col-span-1 lg:row-span-2">
                <div className="group relative isolate flex h-full min-h-[24rem] flex-col justify-between overflow-hidden rounded-[2rem] bg-brand p-8 text-white transition-transform duration-500 ease-out hover:-translate-y-1.5 hover:-rotate-[0.6deg] sm:p-10">
                  <FeaturedShape />
                  <span className="grid size-20 place-items-center rounded-3xl bg-white/15 ring-1 ring-white/20 sm:size-24">
                    <DisciplineIcon name={featured.icon} className="size-11 sm:size-14" />
                  </span>
                  <div className="mt-16">
                    <p className="font-heading text-lg font-semibold text-white/60">01</p>
                    <h3 className="mt-2 font-heading text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
                      {featured.title}
                    </h3>
                    <p className="mt-3 max-w-sm leading-relaxed text-white/80">
                      {featured.description}
                    </p>
                    <Topics topics={featured.topics} tone="dark" className="mt-6" />
                  </div>
                </div>
              </li>
            ) : null}

            {others.map((d, i) => (
              <li key={d.slug} data-discipline-card>
                <div
                  className={cn(
                    "group flex h-full flex-col rounded-[2rem] bg-white p-7 shadow-[0_18px_40px_-24px_rgb(65_105_225/0.45)] ring-1 ring-black/5 transition-transform duration-500 ease-out hover:-translate-y-1.5 sm:p-8",
                    i % 2 ? "hover:rotate-[0.6deg]" : "hover:-rotate-[0.6deg]",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className="grid size-14 place-items-center rounded-2xl bg-brand-tint text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                      <DisciplineIcon name={d.icon} className="size-8" />
                    </span>
                    <span className="font-heading text-lg font-semibold text-black/25">
                      {String(i + 2).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-8 font-heading text-2xl leading-tight font-bold tracking-tight">
                    {d.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-black/60">{d.description}</p>
                  <Topics topics={d.topics} tone="light" className="mt-auto pt-6" />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <ScrollMarquee items={copy.formats} label={copy.formatsLabel} className="mt-20 sm:mt-24" />
      </div>
    </section>
  );
}

function Topics({
  topics,
  tone,
  className,
}: {
  topics: string[];
  tone: "light" | "dark";
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {topics.map((topic) => (
        <li
          key={topic}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            tone === "dark" ? "bg-white/15 text-white" : "bg-brand-tint text-brand-strong",
          )}
        >
          {topic}
        </li>
      ))}
    </ul>
  );
}

/** Organic lighter-blue shape in the featured card (BeeToGreen swoosh feel). */
function FeaturedShape() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      className="absolute -right-24 -bottom-24 -z-10 size-[26rem] text-white/10 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-6"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="46"
        strokeLinecap="round"
        d="M40 330C80 220 170 250 210 170s-30-130 40-130 120 90 70 170"
      />
    </svg>
  );
}

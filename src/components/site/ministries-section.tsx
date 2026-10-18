"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  ArrowUpRight,
  ChevronRight,
  Church,
  CircleCheck,
  GraduationCap,
  Megaphone,
  Quote,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type Copy = Dictionary["ministries"];

/** Icon per branch, in the order of `ministries.items`: crusades, academy, Joseph Store, church. */
const branchIcons: LucideIcon[] = [Megaphone, GraduationCap, Wheat, Church];
/** Index of the JAFAN Academy, which also shows its study path. */
const ACADEMY = 1;

/**
 * "JAFAN Ministries" as a tabbed showcase: a centred header with the website button, then
 * a light panel where the four branches are numbered tabs (a column on desktop, a
 * scrollable row on phones) next to a white detail card. The motto closes the section.
 */
export function MinistriesSection({ copy, websiteUrl }: { copy: Copy; websiteUrl: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const baseId = useId();
  const branch = copy.items[active];
  const Icon = branchIcons[active] ?? Church;

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const count = copy.items.length;
    const keys: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: count - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = (keys[event.key] + count) % count;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const reverse = "play none none reverse";
        const split = SplitText.create("[data-ministries-heading]", {
          type: "lines",
          mask: "lines",
        });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: "[data-ministries-heading]",
            start: "top 85%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-ministries-intro]", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-ministries-heading]",
            start: "top 80%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-ministries-panel]", {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-ministries-panel]",
            start: "top 85%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-ministries-tab]", {
          x: -24,
          opacity: 0,
          duration: 0.6,
          stagger: 0.07,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-ministries-panel]",
            start: "top 85%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-ministries-motto] > *", {
          y: 30,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-ministries-motto]",
            start: "top 85%",
            toggleActions: reverse,
          },
        });
        return () => split.revert();
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="ministries" className="bg-white py-20 text-ink sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p
            data-ministries-intro
            className="inline-flex items-center gap-2 rounded-full bg-mist px-3.5 py-1.5 text-xs font-medium text-black/65"
          >
            <span aria-hidden className="size-1.5 rounded-full bg-brand" />
            {copy.label}
          </p>
          <h2
            data-ministries-heading
            className="mt-5 font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl"
          >
            {copy.headingLead} <span className="text-brand">{copy.headingHighlight}</span>
          </h2>
          <p data-ministries-intro className="mt-5 leading-relaxed text-black/60">
            {copy.intro}
          </p>
          <div data-ministries-intro className="mt-7">
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
            >
              {copy.ctaButton}
              <span className="sr-only">{copy.newTab}</span>
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div
          data-ministries-panel
          className="mt-14 grid gap-3 rounded-[1.75rem] bg-mist p-3 sm:mt-16 lg:grid-cols-[19rem_1fr]"
        >
          <div
            role="tablist"
            aria-label={copy.listLabel}
            aria-orientation="vertical"
            className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:p-0"
          >
            {copy.items.map((item, i) => {
              const selected = i === active;
              return (
                <button
                  key={item.name}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  data-ministries-tab
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${i}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={onTabKey}
                  className={cn(
                    "flex w-56 shrink-0 snap-start items-start gap-3 rounded-2xl p-4 text-left transition-colors lg:w-auto",
                    selected
                      ? "bg-white shadow-[0_8px_24px_-12px_rgb(10_10_10/0.25)]"
                      : "hover:bg-white/60",
                  )}
                >
                  <span
                    className={cn(
                      "pt-0.5 text-xs font-semibold tabular-nums",
                      selected ? "text-brand" : "text-black/35",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-heading leading-snug font-semibold tracking-tight">
                      {item.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-black/50">{item.tagline}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${active}`}
            className="relative isolate overflow-hidden rounded-[1.4rem] bg-white p-7 sm:p-10"
          >
            {/* Big faint number of the active branch */}
            <span
              aria-hidden
              className="absolute -right-2 -bottom-10 -z-10 font-heading text-[11rem] leading-none font-semibold tracking-tighter text-brand-tint select-none sm:text-[14rem]"
            >
              {String(active + 1).padStart(2, "0")}
            </span>

            {/* Keyed so the content fades in again on every tab change. */}
            <div key={active} className="animate-fade-up">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-tint text-brand">
                  <Icon aria-hidden strokeWidth={1.75} className="size-6" />
                </span>
                <span className="rounded-full bg-mist px-3 py-1 text-xs font-medium text-black/65">
                  {branch.fact}
                </span>
              </div>
              <h3 className="mt-7 font-heading text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-3xl">
                {branch.name}
              </h3>
              <p className="mt-3 max-w-xl leading-relaxed text-black/60">{branch.description}</p>

              <ul className="mt-7 grid max-w-xl gap-3 sm:grid-cols-2">
                {branch.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2.5 text-sm">
                    <CircleCheck
                      aria-hidden
                      strokeWidth={2}
                      className="mt-0.5 size-4 shrink-0 text-brand"
                    />
                    <span className="font-medium">{highlight}</span>
                  </li>
                ))}
              </ul>

              {active === ACADEMY ? (
                <div className="mt-8">
                  <p className="text-xs font-medium text-black/45">{copy.academyPathLabel}</p>
                  <ol className="mt-2 flex flex-wrap items-center gap-1.5">
                    {copy.academyPath.map((step, i) => (
                      <li key={step} className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium",
                            i === copy.academyPath.length - 1
                              ? "bg-brand text-white"
                              : "bg-mist text-black/70",
                          )}
                        >
                          {step}
                        </span>
                        {i < copy.academyPath.length - 1 ? (
                          <ChevronRight aria-hidden className="size-3.5 text-black/30" />
                        ) : null}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Motto */}
        <figure data-ministries-motto className="mx-auto mt-16 max-w-3xl text-center sm:mt-20">
          <Quote aria-hidden className="mx-auto size-7 text-brand" strokeWidth={1.75} />
          <blockquote className="mt-4 font-heading text-2xl leading-[1.15] font-medium tracking-tight text-balance sm:text-3xl">
            {copy.mottoLead} <span className="text-brand">{copy.mottoHighlight}</span>
          </blockquote>
          <figcaption className="mt-4 text-sm font-medium text-black/45">
            {copy.mottoLabel}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

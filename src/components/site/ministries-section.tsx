"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
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

/** Icon for each branch, in the order of `ministries.items` in the dictionaries. */
const icons: LucideIcon[] = [Megaphone, GraduationCap, Wheat, Church];

/**
 * "JAFAN Ministries" section in the BeeToGreen style: a rounded light-blue panel with a
 * big centred heading, a tab switcher (like BeeToGreen's Companies / Employees tabs) for
 * the four branches, and the ministry motto in large type.
 */
export function MinistriesSection({ copy }: { copy: Copy }) {
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const baseId = useId();
  const count = copy.items.length;
  const current = copy.items[active];
  const CurrentIcon = icons[active] ?? Church;

  // WAI-ARIA tabs: arrow keys move between tabs, Home/End jump to the ends.
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowDown: active + 1,
      ArrowLeft: active - 1,
      ArrowUp: active - 1,
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
          duration: 1.1,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: "[data-ministries-heading]",
            start: "top 85%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-ministries-intro]", {
          y: 30,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-ministries-heading]",
            start: "top 75%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-ministries-pop]", {
          y: 80,
          opacity: 0,
          scale: 0.95,
          duration: 0.9,
          stagger: 0.12,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: "[data-ministries-switcher]",
            start: "top 80%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-ministries-motto] > *", {
          y: 40,
          opacity: 0,
          duration: 1,
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
    <section ref={sectionRef} id="ministries" className="bg-white px-2 pb-2 sm:px-4 sm:pb-4">
      <div className="overflow-hidden rounded-[2rem] bg-brand-tint py-20 text-ink sm:rounded-[3rem] sm:py-28 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Header */}
          <div className="mx-auto max-w-4xl text-center">
            <p
              data-ministries-intro
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-medium tracking-wide text-black/70 shadow-sm sm:text-sm"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-brand" />
              {copy.label}
            </p>
            <h2
              data-ministries-heading
              className="mt-6 font-heading text-[2.4rem] leading-[1.02] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl"
            >
              {copy.headingLead} <span className="text-brand">{copy.headingHighlight}</span>
            </h2>
            <p
              data-ministries-intro
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-black/65 sm:text-lg"
            >
              {copy.intro}
            </p>
          </div>

          {/* Tab switcher */}
          <div
            data-ministries-switcher
            className="mt-14 grid gap-4 sm:mt-20 sm:gap-5 lg:grid-cols-[22rem_1fr]"
          >
            <div
              data-ministries-pop
              role="tablist"
              aria-label={copy.tablistLabel}
              className="-mx-5 flex snap-x [scrollbar-width:none] gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0 lg:flex-col lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
            >
              {copy.items.map((item, i) => {
                const Icon = icons[i] ?? Church;
                const selected = i === active;
                return (
                  <button
                    key={item.name}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${i}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(i)}
                    onKeyDown={onTabKeyDown}
                    className={cn(
                      "group flex shrink-0 snap-start items-center gap-4 rounded-2xl p-3 pr-5 text-left transition-all duration-300 lg:p-4",
                      selected
                        ? "bg-white shadow-[0_18px_40px_-24px_rgb(65_105_225/0.6)] ring-1 ring-brand/30"
                        : "hover:bg-white/70",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-12 shrink-0 place-items-center rounded-xl transition-colors duration-300",
                        selected
                          ? "bg-brand text-white"
                          : "bg-white text-brand ring-1 ring-black/5",
                      )}
                    >
                      <Icon aria-hidden strokeWidth={1.75} className="size-6" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-heading font-semibold tracking-tight whitespace-nowrap lg:whitespace-normal">
                        {item.name}
                      </span>
                      <span className="hidden text-sm text-black/55 lg:block">{item.tagline}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {current ? (
              <div
                data-ministries-pop
                id={`${baseId}-panel`}
                role="tabpanel"
                aria-labelledby={`${baseId}-tab-${active}`}
                tabIndex={0}
                className="relative isolate overflow-hidden rounded-[2rem] bg-white p-7 shadow-[0_30px_60px_-30px_rgb(15_23_42/0.25)] ring-1 ring-black/5 sm:p-10 lg:p-12"
              >
                <PanelShape />
                {/* Remounting on change replays the entrance animation. */}
                <div key={active} className="animate-fade-up">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="grid size-16 place-items-center rounded-2xl bg-brand text-white sm:size-20">
                      <CurrentIcon aria-hidden strokeWidth={1.75} className="size-8 sm:size-10" />
                    </span>
                    <span className="rounded-full bg-brand-tint px-3 py-1 text-sm font-medium text-brand-strong">
                      {current.fact}
                    </span>
                  </div>
                  <p className="mt-8 text-sm font-medium text-black/45">
                    {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-heading text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                    {current.name}
                  </h3>
                  <p className="mt-4 max-w-2xl text-lg leading-relaxed text-black/65">
                    {current.description}
                  </p>
                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {current.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-3">
                        <CircleCheck
                          aria-hidden
                          strokeWidth={2}
                          className="mt-0.5 size-5 shrink-0 text-brand"
                        />
                        <span className="font-medium">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>

          {/* Motto */}
          <figure data-ministries-motto className="mx-auto mt-20 max-w-4xl text-center sm:mt-28">
            <Quote aria-hidden className="mx-auto size-10 text-brand" strokeWidth={1.75} />
            <blockquote className="mt-6 font-heading text-3xl leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl">
              {copy.mottoLead} <span className="text-brand">{copy.mottoHighlight}</span>
            </blockquote>
            <figcaption className="mt-6 text-sm font-medium text-black/50">
              {copy.mottoLabel}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/** Soft royal-blue swoosh in the panel corner (BeeToGreen feel). */
function PanelShape() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      className="absolute -right-28 -bottom-28 -z-10 size-[24rem] text-brand/[0.07]"
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

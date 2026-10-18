"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Award, Globe, GraduationCap, ScrollText, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type Copy = Dictionary["academics"];
type Item = { title: string; org: string; year?: string };

/**
 * "Academic background" section in the BeeToGreen style: a dark rounded panel with a
 * big centred heading and a bento grid of degree cards — a royal-blue Professeur Agrégé
 * card, doctorates, degrees & diplomas, and a highlighted 2025 Canada card.
 */
export function AcademicsSection({ copy }: { copy: Copy }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const reverse = "play none none reverse";
        const split = SplitText.create("[data-academics-heading]", {
          type: "lines",
          mask: "lines",
        });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: "[data-academics-heading]",
            start: "top 85%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-academics-intro]", {
          y: 30,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-academics-heading]",
            start: "top 75%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-academics-card]", {
          y: 80,
          opacity: 0,
          scale: 0.94,
          duration: 0.9,
          stagger: 0.1,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: "[data-academics-grid]",
            start: "top 80%",
            toggleActions: reverse,
          },
        });
        return () => split.revert();
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="academics" className="bg-white px-2 pb-2 sm:px-4 sm:pb-4">
      <div className="overflow-hidden rounded-[2rem] bg-ink py-20 text-white sm:rounded-[3rem] sm:py-28 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Header */}
          <div className="mx-auto max-w-4xl text-center">
            <p
              data-academics-intro
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-white/80 sm:text-sm"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-brand-soft" />
              {copy.label}
            </p>
            <h2
              data-academics-heading
              className="mt-6 font-heading text-[2.4rem] leading-[1.02] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl"
            >
              {copy.headingLead} <span className="text-brand-soft">{copy.headingHighlight}</span>
            </h2>
            <p
              data-academics-intro
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg"
            >
              {copy.intro}
            </p>
          </div>

          {/* Bento grid */}
          <ul
            data-academics-grid
            aria-label={copy.cardsLabel}
            className="mt-16 grid gap-4 sm:mt-20 sm:gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {/* Professeur Agrégé (tall, royal blue) */}
            <li data-academics-card className="md:col-span-2 lg:col-span-1 lg:row-span-2">
              <div className="group relative isolate flex h-full min-h-[22rem] flex-col justify-between overflow-hidden rounded-[2rem] bg-brand p-8 transition-transform duration-500 ease-out hover:-translate-y-1.5 hover:-rotate-[0.6deg] sm:p-10">
                <CardShape />
                <IconTile
                  icon={GraduationCap}
                  className="size-20 rounded-3xl bg-white/15 sm:size-24"
                  iconClassName="size-11 sm:size-12"
                />
                <div className="mt-14">
                  <p className="text-sm font-medium text-white/70">{copy.featured.eyebrow}</p>
                  <h3 className="mt-2 font-heading text-4xl leading-none font-bold tracking-tight sm:text-5xl">
                    {copy.featured.title}
                  </h3>
                  <p className="mt-4 max-w-sm leading-relaxed text-white/85">
                    {copy.featured.description}
                  </p>
                  <p className="mt-6 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                    {copy.featured.tag}
                  </p>
                </div>
              </div>
            </li>

            {/* Doctorates */}
            <li data-academics-card>
              <ListCard icon={Award} title={copy.doctorates.title} items={copy.doctorates.items} />
            </li>

            {/* Degrees & diplomas (tall) */}
            <li data-academics-card className="lg:row-span-2">
              <ListCard icon={ScrollText} title={copy.degrees.title} items={copy.degrees.items} />
            </li>

            {/* 2025 · Canada (highlight) */}
            <li data-academics-card>
              <ListCard
                icon={Globe}
                title={copy.recent.title}
                subtitle={copy.recent.subtitle}
                items={copy.recent.items}
                highlight
              />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function ListCard({
  icon,
  title,
  subtitle,
  items,
  highlight = false,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  items: Item[];
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "group flex h-full flex-col rounded-[2rem] p-7 transition-transform duration-500 ease-out hover:-translate-y-1.5 sm:p-8",
        highlight
          ? "bg-brand-soft text-ink hover:rotate-[0.6deg]"
          : "bg-white/[0.06] ring-1 ring-white/10 hover:-rotate-[0.6deg]",
      )}
    >
      <div className="flex items-center gap-4">
        <IconTile
          icon={icon}
          className={cn(
            "size-12 rounded-2xl",
            highlight ? "bg-ink text-white" : "bg-white/10 text-brand-soft",
          )}
          iconClassName="size-6"
        />
        <div>
          <h3 className="font-heading text-2xl leading-tight font-bold tracking-tight">{title}</h3>
          {subtitle ? (
            <p className={cn("text-sm", highlight ? "text-ink/65" : "text-white/55")}>{subtitle}</p>
          ) : null}
        </div>
      </div>
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li
            key={item.title}
            className={cn(
              "flex items-start justify-between gap-4 border-t pt-4",
              highlight ? "border-ink/15" : "border-white/10",
            )}
          >
            <div>
              <p className="leading-snug font-semibold">{item.title}</p>
              <p
                className={cn(
                  "mt-1 text-sm leading-snug",
                  highlight ? "text-ink/65" : "text-white/55",
                )}
              >
                {item.org}
              </p>
            </div>
            {item.year ? (
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium tabular-nums",
                  highlight ? "bg-ink text-white" : "bg-white/10 text-white/80",
                )}
              >
                {item.year}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function IconTile({
  icon: Icon,
  className,
  iconClassName,
}: {
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span className={cn("grid shrink-0 place-items-center ring-1 ring-white/15", className)}>
      <Icon aria-hidden strokeWidth={1.75} className={iconClassName} />
    </span>
  );
}

/** Organic lighter-blue shape in the featured card (BeeToGreen swoosh feel). */
function CardShape() {
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

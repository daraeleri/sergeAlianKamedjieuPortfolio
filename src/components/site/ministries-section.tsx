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
import { useRef } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type Copy = Dictionary["ministries"];
type Branch = Copy["items"][number];

/**
 * "JAFAN Ministries" section in the BeeToGreen style: a rounded light-blue panel with a
 * left-aligned header and website button, a bento grid of the four branches (the JAFAN
 * Academy as a big royal-blue card), a dark call-to-action card to the JAFAN website,
 * and the ministry motto. Branch order follows `ministries.items` in the dictionaries:
 * crusades, academy, Joseph Store, church.
 */
export function MinistriesSection({ copy, websiteUrl }: { copy: Copy; websiteUrl: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [crusades, academy, josephStore, church] = copy.items;

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
            start: "top 80%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-ministry-card]", {
          y: 80,
          opacity: 0,
          scale: 0.95,
          duration: 0.9,
          stagger: 0.1,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: "[data-ministries-grid]",
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
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
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
            </div>
            <div className="max-w-md space-y-6 lg:justify-self-end lg:pb-2">
              <p data-ministries-intro className="text-lg leading-relaxed text-black/65">
                {copy.intro}
              </p>
              <div data-ministries-intro>
                <WebsiteLink
                  href={websiteUrl}
                  label={copy.ctaButton}
                  newTab={copy.newTab}
                  className="bg-brand text-white shadow-[0_10px_30px_-10px] shadow-brand hover:bg-brand-strong"
                />
              </div>
            </div>
          </div>

          {/* Bento grid */}
          <ul
            data-ministries-grid
            aria-label={copy.listLabel}
            className="mt-14 grid gap-4 sm:mt-20 sm:gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {academy ? (
              <li data-ministry-card className="md:col-span-2">
                <AcademyCard branch={academy} copy={copy} />
              </li>
            ) : null}
            {crusades ? (
              <li data-ministry-card>
                <BranchCard branch={crusades} icon={Megaphone} />
              </li>
            ) : null}
            {josephStore ? (
              <li data-ministry-card>
                <BranchCard branch={josephStore} icon={Wheat} />
              </li>
            ) : null}
            {church ? (
              <li data-ministry-card>
                <BranchCard branch={church} icon={Church} />
              </li>
            ) : null}
            <li data-ministry-card>
              <div className="group relative isolate flex h-full flex-col justify-between overflow-hidden rounded-[2rem] bg-ink p-7 text-white transition-transform duration-500 ease-out hover:-translate-y-1.5 sm:p-8">
                <div
                  aria-hidden
                  className="absolute -top-24 -right-24 -z-10 size-72 rounded-full bg-brand/50 blur-3xl transition-transform duration-700 group-hover:scale-125"
                />
                <Swoosh className="absolute -right-24 -bottom-28 -z-10 size-[22rem] text-white/[0.06]" />
                <div>
                  <h3 className="font-heading text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
                    {copy.ctaTitle}
                  </h3>
                  <p className="mt-3 leading-relaxed text-white/70">{copy.ctaText}</p>
                </div>
                <WebsiteLink
                  href={websiteUrl}
                  label={copy.ctaButton}
                  newTab={copy.newTab}
                  className="mt-8 self-start bg-white text-ink hover:bg-brand-soft"
                />
              </div>
            </li>
          </ul>

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

/** The JAFAN Academy: large royal-blue card with the founding year and the study path. */
function AcademyCard({ branch, copy }: { branch: Branch; copy: Copy }) {
  return (
    <div className="group relative isolate flex h-full flex-col gap-10 overflow-hidden rounded-[2rem] bg-brand p-8 text-white transition-transform duration-500 ease-out hover:-translate-y-1.5 hover:-rotate-[0.4deg] sm:p-10 lg:flex-row lg:items-end lg:justify-between">
      <Swoosh className="absolute -right-20 -bottom-24 -z-10 size-[26rem] text-white/10 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-6" />
      <div className="max-w-md">
        <span className="grid size-16 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
          <GraduationCap aria-hidden strokeWidth={1.75} className="size-8" />
        </span>
        <h3 className="mt-8 font-heading text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl">
          {branch.name}
        </h3>
        <p className="mt-3 leading-relaxed text-white/85">{branch.description}</p>
        <p className="sr-only">{copy.academyPathLabel}</p>
        <ol className="mt-6 flex flex-wrap items-center gap-1.5">
          {copy.academyPath.map((step, i) => (
            <li key={step} className="flex items-center gap-1.5">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">{step}</span>
              {i < copy.academyPath.length - 1 ? (
                <ChevronRight aria-hidden className="size-3.5 text-white/60" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
      <div className="lg:text-right">
        <p className="text-sm font-medium text-white/70">{copy.academyFoundedLabel}</p>
        <p className="font-heading text-7xl leading-none font-bold tracking-tight sm:text-8xl">
          2007
        </p>
      </div>
    </div>
  );
}

function BranchCard({ branch, icon: Icon }: { branch: Branch; icon: LucideIcon }) {
  return (
    <div className="group flex h-full flex-col rounded-[2rem] bg-white p-7 shadow-[0_18px_40px_-24px_rgb(65_105_225/0.45)] ring-1 ring-black/5 transition-transform duration-500 ease-out hover:-translate-y-1.5 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-14 place-items-center rounded-2xl bg-brand-tint text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
          <Icon aria-hidden strokeWidth={1.75} className="size-7" />
        </span>
        <span className="rounded-full bg-brand-tint px-3 py-1 text-xs font-medium text-brand-strong">
          {branch.fact}
        </span>
      </div>
      <h3 className="mt-8 font-heading text-2xl leading-tight font-bold tracking-tight">
        {branch.name}
      </h3>
      <p className="mt-2 leading-relaxed text-black/60">{branch.description}</p>
      <ul className="mt-auto space-y-2 pt-6">
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
    </div>
  );
}

/** External link to the JAFAN Ministries website, opening in a new tab. */
function WebsiteLink({
  href,
  label,
  newTab,
  className,
}: {
  href: string;
  label: string;
  newTab: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-medium transition-colors",
        className,
      )}
    >
      {label}
      <span className="sr-only">{newTab}</span>
      <ArrowUpRight
        aria-hidden
        className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}

/** Thick swoosh line (BeeToGreen feel). */
function Swoosh({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 400 400" className={className}>
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

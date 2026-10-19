"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Award, Globe, GraduationCap, ScrollText, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type Copy = Dictionary["academics"];
type Item = { title: string; org: string; year?: string };
type Group = { icon: LucideIcon; title: string; subtitle?: string; items: Item[] };

/**
 * "Academic background" as an editorial record: on desktop a sticky column with the
 * heading and the Professeur Agrégé distinction, next to a numbered list of every degree
 * (doctorates, degrees & diplomas, 2025 in Canada) split by hairlines.
 */
export function AcademicsSection({ copy }: { copy: Copy }) {
  const sectionRef = useRef<HTMLElement>(null);
  const groups: Group[] = [
    { icon: Award, title: copy.doctorates.title, items: copy.doctorates.items },
    { icon: ScrollText, title: copy.degrees.title, items: copy.degrees.items },
    {
      icon: Globe,
      title: copy.recent.title,
      subtitle: copy.recent.subtitle,
      items: copy.recent.items,
    },
  ];
  // Rows are numbered across all groups, like one academic record.
  const offsets = groups.map((_, i) =>
    groups.slice(0, i).reduce((total, group) => total + group.items.length, 0),
  );

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
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: "[data-academics-heading]",
            start: "top 85%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-academics-intro]", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-academics-heading]",
            start: "top 80%",
            toggleActions: reverse,
          },
        });
        // Each group's rows slide in one after another as the group reaches the viewport.
        gsap.utils.toArray<HTMLElement>("[data-academics-group]").forEach((group) => {
          gsap.from(group.querySelectorAll("[data-academics-row]"), {
            x: 40,
            opacity: 0,
            duration: 0.7,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 80%", toggleActions: reverse },
          });
        });
        return () => split.revert();
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="academics"
      className="overflow-x-clip bg-white py-20 text-ink sm:py-24"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* Sticky intro column */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p
            data-academics-intro
            className="inline-flex items-center gap-2 rounded-full bg-mist px-3.5 py-1.5 text-xs font-medium text-black/65"
          >
            <span aria-hidden className="size-1.5 rounded-full bg-brand" />
            {copy.label}
          </p>
          <h2
            data-academics-heading
            className="mt-5 font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl"
          >
            {copy.headingLead} <span className="text-brand">{copy.headingHighlight}</span>
          </h2>
          <p data-academics-intro className="mt-5 max-w-md leading-relaxed text-black/60">
            {copy.intro}
          </p>

          {/* Highest distinction, with the portrait standing behind its top edge */}
          <div data-academics-intro className="mt-8">
            <Image
              src="/images/pictureAcademics.png"
              alt=""
              width={584}
              height={851}
              sizes="15rem"
              className="mx-auto block h-auto w-56 sm:w-60"
            />
            <div className="relative isolate z-10 -mt-32 overflow-hidden rounded-2xl bg-brand-tint p-6 ring-1 ring-brand/10">
              <svg
                aria-hidden
                viewBox="0 0 400 400"
                className="absolute -right-16 -bottom-20 -z-10 size-56 text-brand/10"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="46"
                  strokeLinecap="round"
                  d="M40 330C80 220 170 250 210 170s-30-130 40-130 120 90 70 170"
                />
              </svg>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-brand text-white">
                  <GraduationCap aria-hidden strokeWidth={1.75} className="size-5" />
                </span>
                <p className="text-xs font-semibold tracking-[0.14em] text-brand-strong uppercase">
                  {copy.featured.eyebrow}
                </p>
              </div>
              <h3 className="mt-4 font-heading text-2xl font-semibold tracking-tight">
                {copy.featured.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-black/60">
                {copy.featured.description}
              </p>
              <p className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-black/70 ring-1 ring-black/5">
                {copy.featured.tag}
              </p>
            </div>
          </div>
        </div>

        {/* Numbered record */}
        <div aria-label={copy.cardsLabel} role="group" className="space-y-12">
          {groups.map((group, g) => (
            <div key={group.title} data-academics-group>
              <div className="flex items-center gap-3">
                <group.icon aria-hidden strokeWidth={1.75} className="size-5 text-brand" />
                <h3 className="font-heading text-lg font-semibold tracking-tight">{group.title}</h3>
                {group.subtitle ? (
                  <span className="text-sm text-black/45">· {group.subtitle}</span>
                ) : null}
                <span className="ml-auto text-xs font-medium text-black/40 tabular-nums">
                  {String(group.items.length).padStart(2, "0")}
                </span>
              </div>
              <ol className="mt-4 border-b border-black/10">
                {group.items.map((item, i) => (
                  <li
                    key={item.title}
                    data-academics-row
                    className="group grid grid-cols-[2.25rem_1fr_auto] items-start gap-x-3 border-t border-black/10 py-5 sm:grid-cols-[3rem_1fr_auto]"
                  >
                    <span className="pt-0.5 text-sm font-medium text-black/35 tabular-nums transition-colors group-hover:text-brand">
                      {String(offsets[g] + i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="leading-snug font-medium sm:text-[1.05rem]">{item.title}</p>
                      <p className="mt-1 text-sm leading-snug text-black/50">{item.org}</p>
                    </div>
                    {item.year ? (
                      <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-black/65 tabular-nums">
                        {item.year}
                      </span>
                    ) : (
                      <span />
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { CSSProperties } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";

type AboutSectionProps = {
  locale: Locale;
  copy: Dictionary["about"];
};

/**
 * Home "About" section, after the Fluid Glass reference: a mono label row, a large
 * statement that brightens word by word on scroll, a restrained CTA and three pillars.
 */
export function AboutSection({ locale, copy }: AboutSectionProps) {
  return (
    <section id="about" className="bg-white py-20 text-ink sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionLabel label={copy.label} index="01" />

        <Statement text={copy.statement} highlight={copy.statementHighlight} />

        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href={localizePath(locale, "/about")}
            className="group inline-flex items-center gap-3 rounded-md bg-ink px-5 py-3 font-mono text-xs tracking-[0.16em] text-white uppercase transition-colors hover:bg-brand"
          >
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              ↳
            </span>
            {copy.cta}
          </Link>
        </div>

        <ol className="mt-20 grid border-t border-black/10 sm:mt-28 md:grid-cols-3">
          {copy.pillars.map((pillar, index) => (
            <li
              key={pillar.title}
              className={cn(
                "group relative border-b border-black/10 py-8 transition-colors md:border-b-0 md:px-8 md:py-10",
                index > 0 && "md:border-l",
                index === 0 && "md:pl-0",
              )}
            >
              <span className="font-mono text-xs tracking-[0.16em] text-black/40 transition-colors group-hover:text-brand-strong">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                {pillar.title}
              </h3>
              <p className="mt-3 max-w-xs leading-relaxed text-black/60">{pillar.description}</p>
              {/* Blue rule that grows on hover */}
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand transition-all duration-500 group-hover:w-full md:-bottom-px"
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Large centred statement; words get a 0–1 position used by the scroll reveal in globals.css. */
function Statement({ text, highlight }: { text: string; highlight: string }) {
  const start = text.indexOf(highlight);
  const parts =
    start === -1
      ? [{ text, highlighted: false }]
      : [
          { text: text.slice(0, start), highlighted: false },
          { text: highlight, highlighted: true },
          { text: text.slice(start + highlight.length), highlighted: false },
        ];

  const words = parts.flatMap((part) =>
    part.text
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ word, highlighted: part.highlighted })),
  );
  const last = Math.max(words.length - 1, 1);

  return (
    <p className="reveal-text mx-auto mt-16 max-w-5xl text-center font-heading text-[1.75rem] leading-[1.15] font-medium tracking-tight text-balance sm:mt-24 sm:text-4xl md:text-5xl lg:text-[3.5rem]">
      {words.map(({ word, highlighted }, i) => (
        <span key={i}>
          <span
            className={cn("reveal-word", highlighted && "text-brand")}
            style={{ "--p": i / last } as CSSProperties}
          >
            {word}
          </span>{" "}
        </span>
      ))}
    </p>
  );
}

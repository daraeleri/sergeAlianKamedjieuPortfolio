import type { Route } from "next";
import type { CSSProperties } from "react";
import { AboutCard } from "@/components/site/about-card";
import { AboutStats } from "@/components/site/about-stats";
import { profile } from "@/content/profile";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type AboutSectionProps = {
  locale: Locale;
  copy: Dictionary["about"];
};

/**
 * Home "About" section: a large statement that brightens word by word on scroll,
 * followed by the navy introduction card with the portrait and CTAs, and a row of key figures.
 */
export async function AboutSection({ locale, copy }: AboutSectionProps) {
  const year = await currentYear();
  const stats = [
    { value: year - profile.callingYear, ...copy.stats.ministry },
    { value: profile.doctorates, ...copy.stats.doctorates },
    { value: profile.books, ...copy.stats.books },
    { value: profile.academyFounded, ...copy.stats.academy },
  ];

  return (
    <section id="about" className="bg-white py-20 text-ink sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Statement text={copy.statement} highlight={copy.statementHighlight} />
        <AboutCard
          copy={copy}
          primaryHref={`${localizePath(locale, "/")}#academics` as Route}
          contactHref={localizePath(locale, "/contact")}
        />
        <AboutStats stats={stats} label={copy.statsLabel} />
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
    <p className="reveal-text mx-auto max-w-5xl text-center font-heading text-[1.75rem] leading-[1.15] font-medium tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-[3.5rem]">
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

/** Current year, cached so the page can still be prerendered (Cache Components). */
async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

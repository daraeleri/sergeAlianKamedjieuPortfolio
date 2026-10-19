"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  BookOpen,
  Flame,
  Globe,
  GraduationCap,
  HandHeart,
  Search,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useDeferredValue, useEffect, useId, useRef, useState } from "react";
import type { ArticleTheme } from "@/content/articles";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type Copy = Dictionary["articles"];

export type ArticleCardData = Copy["items"][number] & {
  /** Already formatted for the current locale (formatted on the server). */
  dateLabel: string;
  /** ISO date for the <time> element. */
  date: string;
  theme: ArticleTheme;
  image?: string;
};

/** Background and icon of the designed fallback, per theme (until articles have photos). */
const themes: Record<ArticleTheme, { icon: LucideIcon; className: string }> = {
  spirit: {
    icon: Flame,
    className:
      "bg-brand bg-[radial-gradient(circle_at_70%_20%,rgb(255_255_255/0.35),transparent_55%)]",
  },
  leadership: {
    icon: Users,
    className:
      "bg-ink bg-[radial-gradient(circle_at_80%_10%,rgb(65_105_225/0.75),transparent_60%)]",
  },
  scripture: {
    icon: BookOpen,
    className:
      "bg-[#dfe6ff] bg-[radial-gradient(circle_at_30%_15%,rgb(255_255_255/0.9),transparent_55%)] text-brand",
  },
  mission: {
    icon: Globe,
    className: "bg-gradient-to-br from-brand-strong via-brand to-brand-soft",
  },
  life: {
    icon: HandHeart,
    className: "bg-gradient-to-b from-brand-soft to-brand-tint text-brand-strong",
  },
  training: {
    icon: GraduationCap,
    className: "bg-gradient-to-br from-ink via-[#13224d] to-brand",
  },
};

/** Lower-case and strip accents, so "ecritures" finds "Écritures". */
function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/**
 * "Latest articles" section: centred header with a search field that filters the cards as
 * you type, then a grid of image cards with a stepped white panel (category tab, title and
 * excerpt, then an author and date strip). Cards will link to the article detail page once
 * it exists.
 */
export function ArticlesSection({
  copy,
  articles,
  avatar,
}: {
  copy: Copy;
  articles: ArticleCardData[];
  /** Author photo for the byline. */
  avatar: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const inputId = useId();

  const terms = normalize(deferredQuery.trim()).split(/\s+/).filter(Boolean);
  const visible = terms.length
    ? articles.filter((article) => {
        const haystack = normalize(`${article.title} ${article.category} ${article.excerpt}`);
        return terms.every((term) => haystack.includes(term));
      })
    : articles;

  // The page height changes with the number of results.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [visible.length]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const reverse = "play none none reverse";
        const split = SplitText.create("[data-articles-heading]", {
          type: "lines",
          mask: "lines",
        });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: "[data-articles-heading]",
            start: "top 85%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-articles-intro]", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-articles-heading]",
            start: "top 80%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-articles-grid] > li", {
          y: 60,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-articles-grid]",
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
    <section ref={sectionRef} id="articles" className="bg-white px-3 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-mist px-4 py-14 text-ink sm:px-8 sm:py-20 lg:px-12">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p
            data-articles-intro
            className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-black/65 ring-1 ring-black/5"
          >
            <span aria-hidden className="size-1.5 rounded-full bg-brand" />
            {copy.label}
          </p>
          <h2
            data-articles-heading
            className="mt-5 font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl"
          >
            {copy.headingLead} <span className="text-brand">{copy.headingHighlight}</span>
          </h2>
          <p data-articles-intro className="mt-5 leading-relaxed text-black/60">
            {copy.intro}
          </p>

          {/* Search */}
          <form
            data-articles-intro
            role="search"
            // Results already filter as you type; the button only confirms the search.
            onSubmit={(event) => event.preventDefault()}
            className="mx-auto mt-8 flex max-w-lg gap-2"
          >
            <label htmlFor={inputId} className="sr-only">
              {copy.searchLabel}
            </label>
            <div className="relative flex-1">
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-black/40"
              />
              <input
                id={inputId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
                autoComplete="off"
                className="w-full rounded-xl border border-black/10 bg-white py-3 pr-4 pl-10 text-sm text-ink transition-colors outline-none placeholder:text-black/40 focus:border-brand focus:ring-4 focus:ring-brand/15 [&::-webkit-search-cancel-button]:hidden"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
            >
              {copy.searchButton}
            </button>
          </form>
        </div>

        {/* Result count for screen readers */}
        <p aria-live="polite" className="sr-only">
          {terms.length ? copy.results.replace("{count}", String(visible.length)) : ""}
        </p>

        {visible.length ? (
          <ul
            data-articles-grid
            aria-label={copy.listLabel}
            className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
          >
            {visible.map((article) => (
              <li key={article.slug} className="flex">
                <ArticleCard article={article} author={copy.author} avatar={avatar} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl bg-white px-6 py-14 text-center ring-1 ring-black/5">
            <Search aria-hidden className="size-6 text-brand" />
            <p className="text-black/65">{copy.empty.replace("{query}", query.trim())}</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-mist px-4 py-2 text-sm font-medium transition-colors hover:bg-brand-tint hover:text-brand-strong"
            >
              <X aria-hidden className="size-4" />
              {copy.clear}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/** One article: picture (or themed background) with the stepped white panel at the bottom. */
function ArticleCard({
  article,
  author,
  avatar,
}: {
  article: ArticleCardData;
  author: string;
  avatar: string;
}) {
  const theme = themes[article.theme];
  const Icon = theme.icon;

  return (
    <article
      className={cn(
        "group relative isolate flex min-h-[26rem] w-full flex-col justify-end overflow-hidden rounded-2xl p-3 text-white sm:min-h-[28rem] sm:p-4",
        !article.image && theme.className,
      )}
    >
      {article.image ? (
        <Image
          src={article.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="-z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <>
          <svg
            aria-hidden
            viewBox="0 0 400 400"
            className="absolute -top-16 -right-20 -z-10 size-80 opacity-15 transition-transform duration-700 ease-out group-hover:-rotate-6"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="46"
              strokeLinecap="round"
              d="M40 330C80 220 170 250 210 170s-30-130 40-130 120 90 70 170"
            />
          </svg>
          <Icon
            aria-hidden
            strokeWidth={1.25}
            className="absolute top-10 left-8 -z-10 size-20 opacity-30 transition-transform duration-700 ease-out group-hover:scale-110 sm:size-24"
          />
        </>
      )}

      {/* Stepped white panel: category tab, content, byline */}
      <div className="text-ink transition-transform duration-500 ease-out group-hover:-translate-y-1">
        <p className="inline-block rounded-t-xl bg-white px-3.5 pt-2.5 pb-1 text-xs font-medium text-brand-strong">
          {article.category}
        </p>
        <div className="rounded-xl rounded-tl-none rounded-bl-none bg-white px-4 pt-3 pb-4">
          <h3 className="font-heading text-lg leading-snug font-semibold tracking-tight text-balance">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-black/60">
            {article.excerpt}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-b-xl bg-white px-3 pt-1 pb-2.5 text-xs">
          <span className="relative size-7 shrink-0 overflow-hidden rounded-full bg-brand-tint ring-2 ring-white">
            <Image
              src={avatar}
              alt=""
              fill
              sizes="28px"
              className="origin-[50%_8%] scale-[2.2] object-cover object-top"
            />
          </span>
          <span className="font-medium whitespace-nowrap">{author}</span>
          <span aria-hidden className="text-black/30">
            ·
          </span>
          <time dateTime={article.date} className="whitespace-nowrap text-black/55">
            {article.dateLabel}
          </time>
        </div>
      </div>
    </article>
  );
}

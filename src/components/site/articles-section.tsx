"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useRef } from "react";
import { ArticleCard } from "@/components/site/article-card";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { ArticleCardData } from "@/lib/articles";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** Articles shown on the home page; the rest are on the articles page. */
const HOME_COUNT = 6;

/**
 * "Latest articles" on the home page: centred header, the six newest articles as image
 * cards, and a button to the page with every article.
 */
export function ArticlesSection({
  copy,
  articles,
  avatar,
  allHref,
}: {
  copy: Dictionary["articles"];
  /** Newest first. */
  articles: ArticleCardData[];
  avatar: string;
  /** The page listing every article. */
  allHref: Route;
}) {
  const sectionRef = useRef<HTMLElement>(null);

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
        gsap.from("[data-articles-more]", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-articles-more]",
            start: "top 95%",
            toggleActions: reverse,
          },
        });
        return () => split.revert();
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="articles" className="bg-white py-20 text-ink sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p
            data-articles-intro
            className="inline-flex items-center gap-2 rounded-full bg-mist px-3.5 py-1.5 text-xs font-medium text-black/65"
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
        </div>

        <ul
          data-articles-grid
          aria-label={copy.listLabel}
          className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
        >
          {articles.slice(0, HOME_COUNT).map((article) => (
            <li key={article.slug} className="flex">
              <ArticleCard article={article} author={copy.author} avatar={avatar} />
            </li>
          ))}
        </ul>

        <div data-articles-more className="mt-12 flex justify-center">
          <Link
            href={allHref}
            className="group inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
          >
            {copy.seeAll}
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

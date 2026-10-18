"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { BookCard, type BookCardBook } from "@/components/site/book-card";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type Copy = Dictionary["books"];

type BooksSectionProps = {
  copy: Copy;
  books: BookCardBook[];
  orderHref: Route;
};

type CardOptions = { size?: "md" | "lg"; tone?: "tint" | "periwinkle"; className?: string };

/**
 * "Books" section as a flexbox bento (after the reference board): a dark banner with the
 * heading and order button, a royal-blue key-figure card, and the four books as cards
 * that show the real cover when there is one, or the styled fallback otherwise.
 *
 * Desktop columns: [book 1 · figure]  [banner / [book 2 · book 4] [book 3]]
 * With more than four books, the bento keeps the first four and the banner's main button
 * becomes "See all N books", which expands a grid of the remaining books underneath.
 */
const FEATURED_COUNT = 4;
export function BooksSection({ copy, books, orderHref }: BooksSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [first, second, third, fourth] = books;
  const extra = books.slice(FEATURED_COUNT);
  const hasMore = extra.length > 0;
  const [expanded, setExpanded] = useState(false);
  const moreId = useId();

  const toggleMore = () => {
    setExpanded((value) => !value);
    // The page height changes once the panel has opened or closed.
    window.setTimeout(() => ScrollTrigger.refresh(), 550);
  };

  const card = (book: BookCardBook | undefined, options: CardOptions) =>
    book ? (
      <div data-books-card className={cn("flex", options.className)}>
        <BookCard
          book={book}
          coverAlt={copy.coverAlt.replace("{title}", book.title)}
          orderLabel={copy.orderShort}
          orderHref={orderHref}
          size={options.size}
          tone={options.tone}
          className="w-full"
        />
      </div>
    ) : null;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const reverse = "play none none reverse";
        const split = SplitText.create("[data-books-heading]", { type: "lines", mask: "lines" });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: "[data-books-heading]",
            start: "top 85%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-books-card]", {
          y: 80,
          opacity: 0,
          scale: 0.95,
          duration: 0.9,
          stagger: 0.08,
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: "[data-books-bento]",
            start: "top 80%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-books-thumb]", {
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "back.out(1.6)",
          scrollTrigger: {
            trigger: "[data-books-bento]",
            start: "top 75%",
            toggleActions: reverse,
          },
        });
        return () => split.revert();
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="books"
      aria-label={copy.listLabel}
      className="bg-white px-2 py-20 sm:px-4 sm:py-28 lg:py-32"
    >
      <div
        data-books-bento
        className="mx-auto flex max-w-7xl flex-col gap-4 px-3 sm:px-4 lg:flex-row lg:gap-5"
      >
        {/* Column A: tall book + key figure */}
        <div className="flex flex-col gap-4 lg:w-[32%] lg:gap-5">
          {card(first, { size: "lg", tone: "tint", className: "min-h-[30rem] lg:h-[34rem]" })}
          <div data-books-card className="flex lg:flex-1">
            <div className="relative isolate flex w-full flex-col justify-between overflow-hidden rounded-[1.75rem] bg-brand p-7 text-white">
              <div
                aria-hidden
                className="absolute -right-20 -bottom-24 -z-10 size-64 rounded-full bg-brand-soft/60 blur-3xl"
              />
              <BookOpen aria-hidden strokeWidth={1.75} className="size-8 text-white/80" />
              <div className="mt-8">
                <p className="font-heading text-7xl leading-none font-bold tracking-tight">
                  {books.length}
                </p>
                <p className="mt-2 font-heading text-lg font-semibold tracking-tight">
                  {copy.statLabel}
                </p>
                <p className="mt-1 text-sm text-white/70">{copy.statNote}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Column B: banner, then two columns of books */}
        <div className="flex flex-col gap-4 lg:w-[68%] lg:gap-5">
          <div data-books-card className="flex">
            <div className="relative isolate flex w-full flex-col gap-8 overflow-hidden rounded-[1.75rem] bg-ink p-7 text-white sm:p-10 md:flex-row md:items-center md:justify-between">
              <div
                aria-hidden
                className="absolute -top-28 -left-20 -z-10 size-80 rounded-full bg-brand/40 blur-3xl"
              />
              <div className="max-w-md">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-white/80 sm:text-sm">
                  <span aria-hidden className="size-1.5 rounded-full bg-brand-soft" />
                  {copy.label}
                </p>
                <h2
                  data-books-heading
                  className="mt-5 font-heading text-4xl leading-[1.02] font-bold tracking-tight text-balance sm:text-5xl"
                >
                  {copy.headingLead}{" "}
                  <span className="text-brand-soft">{copy.headingHighlight}</span>
                </h2>
                <p className="mt-4 leading-relaxed text-white/65">{copy.intro}</p>
                {hasMore ? (
                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <button
                      type="button"
                      onClick={toggleMore}
                      aria-expanded={expanded}
                      aria-controls={moreId}
                      className="group inline-flex items-center gap-2 rounded-full bg-white py-2 pr-2 pl-5 font-medium text-ink transition-colors hover:bg-brand-soft"
                    >
                      {expanded
                        ? copy.seeLess
                        : copy.seeMore.replace("{count}", String(books.length))}
                      <span className="grid size-8 place-items-center rounded-full bg-ink text-white">
                        <ChevronDown
                          aria-hidden
                          className={cn(
                            "size-4 transition-transform duration-300",
                            expanded && "rotate-180",
                          )}
                        />
                      </span>
                    </button>
                    <Link
                      href={orderHref}
                      className="font-medium text-white underline decoration-brand-soft decoration-2 underline-offset-8 hover:decoration-white"
                    >
                      {copy.orderCta}
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={orderHref}
                    className="group mt-6 inline-flex items-center gap-2 rounded-full bg-white py-2 pr-2 pl-5 font-medium text-ink transition-colors hover:bg-brand-soft"
                  >
                    {copy.orderCta}
                    <span className="grid size-8 place-items-center rounded-full bg-ink text-white">
                      <ArrowRight
                        aria-hidden
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                )}
              </div>
              <CoverFan books={books} />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 sm:flex-row lg:gap-5">
            <div className="flex flex-col gap-4 sm:w-1/2 lg:gap-5">
              {card(second, { tone: "periwinkle", className: "flex-1" })}
              {card(fourth, { tone: "tint", className: "flex-1" })}
            </div>
            <div className="flex flex-col sm:w-1/2">
              {card(third, { size: "lg", tone: "periwinkle", className: "min-h-[30rem] flex-1" })}
            </div>
          </div>
        </div>
      </div>

      {/* Remaining books (only when there are more than four) */}
      {hasMore ? (
        <div
          id={moreId}
          className={cn(
            "mx-auto grid max-w-7xl px-3 transition-[grid-template-rows] duration-500 ease-out sm:px-4",
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden" inert={!expanded}>
            <h3 className="sr-only">{copy.moreLabel}</h3>
            <ul className="flex flex-wrap gap-4 pt-4 lg:gap-5 lg:pt-5">
              {extra.map((book, i) => (
                <li
                  key={book.slug}
                  className={cn(
                    "flex w-full transition-all duration-500 ease-out sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2.5rem)/3)]",
                    expanded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                  )}
                  style={{ transitionDelay: expanded ? `${i * 60}ms` : "0ms" }}
                >
                  <BookCard
                    book={book}
                    coverAlt={copy.coverAlt.replace("{title}", book.title)}
                    orderLabel={copy.orderShort}
                    orderHref={orderHref}
                    tone={i % 2 ? "periwinkle" : "tint"}
                    className="w-full"
                  />
                </li>
              ))}
            </ul>
            <div className="flex justify-center pt-8">
              <button
                type="button"
                onClick={toggleMore}
                aria-expanded={expanded}
                aria-controls={moreId}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-medium text-white transition-colors hover:bg-brand"
              >
                {copy.seeLess}
                <ChevronDown aria-hidden className="size-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

/** Decorative fan of small covers in the banner (cover image, or a mini fallback). */
function CoverFan({ books }: { books: BookCardBook[] }) {
  const angles = ["-rotate-[10deg]", "-rotate-[2deg]", "rotate-[7deg]"];
  return (
    <div aria-hidden className="relative hidden h-44 w-64 shrink-0 md:block">
      {books.slice(0, 3).map((book, i) => (
        <div
          key={book.slug}
          className={cn(
            "absolute top-2",
            i === 0 && "left-0",
            i === 1 && "left-[4.5rem] z-10",
            i === 2 && "left-36",
          )}
        >
          {/* GSAP animates this wrapper; the tilt lives on the inner element. */}
          <div data-books-thumb>
            <div
              className={cn(
                "relative h-40 w-28 overflow-hidden rounded-lg shadow-[0_20px_40px_-15px_rgb(0_0_0/0.7)] ring-1 ring-white/10",
                angles[i],
              )}
            >
              {book.cover ? (
                <Image src={book.cover} alt="" fill sizes="112px" className="object-cover" />
              ) : (
                <div
                  className={cn(
                    "flex h-full flex-col justify-end p-2.5",
                    i === 1 ? "bg-brand text-white" : "bg-brand-tint text-brand-strong",
                  )}
                >
                  <span className="font-heading text-[0.7rem] leading-tight font-bold">
                    {book.title}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

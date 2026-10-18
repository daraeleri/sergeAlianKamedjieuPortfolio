"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import type { Route } from "next";
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
  /** Author line for the fallback covers. */
  author: string;
};

/** Books shown before "See all N books". */
const FEATURED_COUNT = 4;
const tones = ["brand", "ink", "light"] as const;

/**
 * "Books" as a shelf: a split header (heading on the left, count and order button on the
 * right) above a row of books standing on light cards. With more than four books, the
 * rest stay hidden until "See all N books" is pressed.
 */
export function BooksSection({ copy, books, orderHref, author }: BooksSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const hasMore = books.length > FEATURED_COUNT;
  const visible = expanded ? books : books.slice(0, FEATURED_COUNT);

  const toggleMore = () => {
    setExpanded((value) => !value);
    // The page height changes once the new books are in.
    window.setTimeout(() => ScrollTrigger.refresh(), 100);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const reverse = "play none none reverse";
        const split = SplitText.create("[data-books-heading]", { type: "lines", mask: "lines" });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: "[data-books-heading]",
            start: "top 85%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-books-intro]", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-books-heading]",
            start: "top 80%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-books-featured]", {
          y: 70,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-books-shelf]",
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
    <section
      ref={sectionRef}
      id="books"
      aria-label={copy.listLabel}
      className="bg-white py-20 text-ink sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Split header */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p
              data-books-intro
              className="inline-flex items-center gap-2 rounded-full bg-mist px-3.5 py-1.5 text-xs font-medium text-black/65"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-brand" />
              {copy.label}
            </p>
            <h2
              data-books-heading
              className="mt-5 font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl"
            >
              {copy.headingLead} <span className="text-brand">{copy.headingHighlight}</span>
            </h2>
            <p data-books-intro className="mt-5 leading-relaxed text-black/60">
              {copy.intro}
            </p>
          </div>

          <div data-books-intro className="flex shrink-0 flex-col gap-4 md:items-end">
            <p className="flex items-center gap-2 text-sm text-black/55">
              <BookOpen aria-hidden strokeWidth={1.75} className="size-4 text-brand" />
              <span>
                <span className="font-semibold text-ink">{books.length}</span> {copy.statLabel}
                {" · "}
                {copy.statNote}
              </span>
            </p>
            <Link
              href={orderHref}
              className="group inline-flex items-center gap-2 self-start rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-strong md:self-end"
            >
              {copy.orderCta}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* Shelf */}
        <ul
          id={listId}
          data-books-shelf
          className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:mt-14 sm:gap-x-6 lg:grid-cols-4"
        >
          {visible.map((book, i) => (
            <li
              key={book.slug}
              // Books revealed by "See all" fade in; the first four animate on scroll.
              {...(i < FEATURED_COUNT ? { "data-books-featured": "" } : {})}
              className={cn("flex", i >= FEATURED_COUNT && "animate-fade-up")}
              style={
                i >= FEATURED_COUNT
                  ? { animationDelay: `${(i - FEATURED_COUNT) * 70}ms` }
                  : undefined
              }
            >
              <BookCard
                book={book}
                coverAlt={copy.coverAlt.replace("{title}", book.title)}
                orderLabel={copy.orderShort}
                orderHref={orderHref}
                author={author}
                tone={tones[i % tones.length]}
                className="w-full"
              />
            </li>
          ))}
        </ul>

        {hasMore ? (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={toggleMore}
              aria-expanded={expanded}
              aria-controls={listId}
              className="inline-flex items-center gap-2 rounded-xl bg-mist px-5 py-3 text-sm font-medium transition-colors hover:bg-brand-tint hover:text-brand-strong"
            >
              {expanded ? copy.seeLess : copy.seeMore.replace("{count}", String(books.length))}
              <ChevronDown
                aria-hidden
                className={cn("size-4 transition-transform duration-300", expanded && "rotate-180")}
              />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRight, BookOpen, Crown, Flame, Sparkles, type LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useRef } from "react";
import { BookCover, type CoverTheme } from "@/components/site/book-cover";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type Copy = Dictionary["books"];

/** Look of each book card, in the order of `books.items` in the dictionaries. */
const looks: { icon: LucideIcon; cover: CoverTheme; panel: string }[] = [
  { icon: Flame, cover: "ink", panel: "bg-brand" },
  { icon: Sparkles, cover: "royal", panel: "bg-brand-soft" },
  { icon: Crown, cover: "paper", panel: "bg-ink" },
  { icon: BookOpen, cover: "royal", panel: "bg-[#dfe7ff]" },
];

/**
 * "Books" section in the BeeToGreen style: big centred heading, four chunky book cards
 * (a coloured panel holding a tilted cover, then title, description and topics), and a
 * royal-blue strip to order a book.
 */
export function BooksSection({ copy, orderHref }: { copy: Copy; orderHref: Route }) {
  const sectionRef = useRef<HTMLElement>(null);

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
        gsap.from("[data-books-intro]", {
          y: 30,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-books-heading]",
            start: "top 75%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-book-card]", {
          y: 90,
          opacity: 0,
          scale: 0.94,
          duration: 0.9,
          stagger: 0.1,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: "[data-books-grid]",
            start: "top 80%",
            toggleActions: reverse,
          },
        });
        // Covers drift up slightly faster than the page for a little depth.
        gsap.fromTo(
          "[data-book-cover]",
          { yPercent: 10 },
          {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-books-grid]",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
        gsap.from("[data-books-order]", {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-books-order]",
            start: "top 90%",
            toggleActions: reverse,
          },
        });
        return () => split.revert();
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="books" className="bg-white py-20 text-ink sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <p
            data-books-intro
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-medium tracking-wide text-black/70 shadow-sm sm:text-sm"
          >
            <span aria-hidden className="size-1.5 rounded-full bg-brand" />
            {copy.label}
          </p>
          <h2
            data-books-heading
            className="mt-6 font-heading text-[2.4rem] leading-[1.02] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            {copy.headingLead} <span className="text-brand">{copy.headingHighlight}</span>
          </h2>
          <p
            data-books-intro
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-black/65 sm:text-lg"
          >
            {copy.intro}
          </p>
        </div>

        {/* Book cards */}
        <ul
          data-books-grid
          aria-label={copy.listLabel}
          className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
        >
          {copy.items.map((book, i) => {
            const look = looks[i % looks.length];
            return (
              <li key={book.title} data-book-card>
                <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_40px_-24px_rgb(65_105_225/0.45)] ring-1 ring-black/5 transition-transform duration-500 ease-out hover:-translate-y-1.5">
                  <div
                    className={cn("relative grid place-items-center px-8 pt-10 pb-12", look.panel)}
                  >
                    <div data-book-cover className="w-[72%] max-w-[15rem]">
                      <BookCover
                        title={book.title}
                        author={copy.author}
                        icon={look.icon}
                        theme={look.cover}
                        alt={copy.coverAlt.replace("{title}", book.title)}
                        className={cn(
                          "transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:rotate-0",
                          i % 2 ? "rotate-[4deg]" : "-rotate-[4deg]",
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <p className="text-xs font-medium text-black/45">{copy.languageTag}</p>
                    <h3 className="mt-2 font-heading text-xl leading-snug font-bold tracking-tight">
                      {book.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-black/60">{book.description}</p>
                    <ul className="mt-auto flex flex-wrap gap-2 pt-5">
                      {book.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-brand-tint px-3 py-1 text-xs font-medium text-brand-strong"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        {/* Order strip */}
        <div
          data-books-order
          className="relative isolate mt-5 flex flex-col gap-6 overflow-hidden rounded-[2rem] bg-brand p-8 text-white sm:p-10 md:flex-row md:items-center md:justify-between"
        >
          <OrderShape />
          <div className="max-w-xl">
            <h3 className="font-heading text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
              {copy.orderTitle}
            </h3>
            <p className="mt-2 text-white/80">{copy.orderText}</p>
          </div>
          <Link
            href={orderHref}
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-white px-6 py-3.5 font-medium text-ink transition-colors hover:bg-ink hover:text-white md:self-auto"
          >
            {copy.orderCta}
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Soft swoosh behind the order strip (BeeToGreen feel). */
function OrderShape() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      className="absolute -top-40 right-24 -z-10 size-[24rem] text-white/10"
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

"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { Route } from "next";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BookCover } from "@/components/books/book-cover";
import { SectionLabel } from "@/components/ui/section-label";
import type { Book } from "@/content/books";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** A book with its text already resolved for the current locale. */
export type LocalizedBook = Pick<Book, "slug" | "year" | "publisher" | "theme" | "cover"> & {
  title: string;
  subtitle: string;
  summary: string;
  tags: string[];
  href: Route;
};

type BooksSectionProps = {
  copy: Dictionary["books"];
  books: LocalizedBook[];
  author: string;
  allBooksHref: Route;
};

/** Card panel colour behind each shelf cover (Aardvark Book Club style). */
const panels: Record<Book["theme"], string> = {
  royal: "bg-[#1c2c66]",
  ink: "bg-white/[0.06] ring-1 ring-white/10",
  paper: "bg-[#f3efe6] text-ink",
  sky: "bg-brand",
};

/**
 * Home "Books" section: dark rounded panel, a heading that fills in letter by letter
 * on scroll, a featured book that turns in 3D as it scrolls into view, and a shelf
 * of tilted book cards in a horizontal carousel.
 */
export function BooksSection({ copy, books, author, allBooksHref }: BooksSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shelfRef = useRef<HTMLUListElement>(null);
  const [featured, ...shelf] = books;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Heading letters fill from faint to solid as the heading scrolls up.
        const split = SplitText.create("[data-books-heading]", { type: "words,chars" });
        gsap.fromTo(
          split.chars,
          { opacity: 0.15 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.04,
            scrollTrigger: {
              trigger: "[data-books-heading]",
              start: "top 85%",
              end: "bottom 50%",
              scrub: true,
            },
          },
        );

        // 2. Featured book turns towards the reader and settles as it enters.
        gsap.fromTo(
          "[data-book-3d]",
          { rotateY: -48, rotateX: 10, y: 140 },
          {
            rotateY: -18,
            rotateX: 2,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-featured]",
              start: "top bottom",
              end: "center 55%",
              scrub: 1,
            },
          },
        );
        gsap.from("[data-featured-text] > *", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-featured-text]", start: "top 80%" },
        });
        gsap.from("[data-annotation]", {
          opacity: 0,
          scale: 0.6,
          rotate: -30,
          duration: 0.8,
          ease: "back.out(2)",
          scrollTrigger: { trigger: "[data-featured]", start: "top 60%" },
        });

        // 3. Shelf cards rise into their tilted positions one after another.
        gsap.from("[data-shelf-card]", {
          y: 180,
          opacity: 0,
          rotate: (i: number) => (i % 2 ? 10 : -10),
          duration: 1.1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: shelfRef.current, start: "top 85%" },
        });

        return () => split.revert();
      });
    },
    { scope: sectionRef },
  );

  // Enable each arrow only when the shelf can actually scroll that way.
  const [canScroll, setCanScroll] = useState({ prev: false, next: false });
  useEffect(() => {
    const shelfEl = shelfRef.current;
    if (!shelfEl) return;
    const update = () =>
      setCanScroll({
        prev: shelfEl.scrollLeft > 4,
        next: shelfEl.scrollLeft + shelfEl.clientWidth < shelfEl.scrollWidth - 4,
      });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(shelfEl);
    shelfEl.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      shelfEl.removeEventListener("scroll", update);
    };
  }, []);

  const scrollShelf = (direction: 1 | -1) => {
    const shelfEl = shelfRef.current;
    const card = shelfEl?.querySelector("li");
    if (!shelfEl || !card) return;
    shelfEl.scrollBy({ left: direction * (card.clientWidth + 24), behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} id="books" className="bg-white px-2 pb-2 sm:px-4 sm:pb-4">
      <div className="overflow-hidden rounded-[2rem] bg-ink py-20 text-white sm:rounded-[3rem] sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionLabel label={copy.label} index="02" tone="dark" />

          {/* Header: heading + intro */}
          <div className="mt-14 grid gap-8 sm:mt-20 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <h2
              data-books-heading
              className="font-heading text-[2.6rem] leading-[0.98] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl"
            >
              {copy.headingLead} <span className="text-brand-soft">{copy.headingHighlight}</span>{" "}
              {copy.headingTail}
            </h2>
            <div className="max-w-md space-y-6 lg:justify-self-end lg:pb-2">
              <p className="text-lg leading-relaxed text-white/65">{copy.intro}</p>
              <Link
                href={allBooksHref}
                className="group inline-flex items-center gap-3 rounded-md bg-white px-5 py-3 font-mono text-xs tracking-[0.16em] text-ink uppercase transition-colors hover:bg-brand-soft"
              >
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  ↳
                </span>
                {copy.allBooks}
              </Link>
            </div>
          </div>

          {/* Featured book */}
          {featured ? (
            <div
              data-featured
              className="mt-20 grid items-center gap-14 sm:mt-28 md:grid-cols-[1fr_1.1fr] lg:gap-20"
            >
              <div className="relative flex justify-center py-6 [perspective:1600px]">
                <div
                  aria-hidden
                  className="absolute top-1/2 left-1/2 size-[85%] -translate-1/2 rounded-full bg-brand/30 blur-[90px]"
                />
                <Book3D book={featured} author={author} alt={coverAlt(copy, featured)} />
                <p
                  data-annotation
                  aria-hidden
                  className="absolute -top-8 right-[2%] flex rotate-[-8deg] items-start gap-1 font-script text-3xl text-brand-soft sm:right-[6%] sm:text-4xl"
                >
                  {copy.annotation}
                  <svg viewBox="0 0 40 40" className="mt-4 size-8 sm:size-10" fill="none">
                    <path
                      d="M4 6c14 0 26 8 28 26m0 0-7-5m7 5 3-8"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </p>
              </div>

              <div data-featured-text>
                <p className="font-mono text-xs tracking-[0.16em] text-white/50 uppercase">
                  {copy.featuredLabel} · {featured.year}
                </p>
                <h3 className="mt-4 font-heading text-4xl leading-none font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  {featured.title}
                </h3>
                <p className="mt-3 text-lg text-brand-soft">{featured.subtitle}</p>
                <p className="mt-6 max-w-lg leading-relaxed text-white/65">{featured.summary}</p>
                <Tags tags={featured.tags} className="mt-6" />
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Link
                    href={featured.href}
                    className="rounded-xl bg-brand px-6 py-3.5 font-medium text-white transition-colors hover:bg-brand-strong"
                  >
                    {copy.getBook}
                  </Link>
                  <Link
                    href={featured.href}
                    className="group inline-flex items-center gap-2 font-medium underline decoration-brand-soft decoration-2 underline-offset-8 hover:decoration-white"
                  >
                    {copy.readMore}
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ) : null}

          {/* Shelf */}
          {shelf.length > 0 ? (
            <div className="mt-24 sm:mt-32">
              <div className="flex items-end justify-between gap-4 border-t border-white/15 pt-6">
                <h3 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                  {copy.shelfTitle}
                </h3>
                <div className="flex gap-2">
                  <ArrowButton
                    label={copy.previous}
                    onClick={() => scrollShelf(-1)}
                    disabled={!canScroll.prev}
                    flip
                  />
                  <ArrowButton
                    label={copy.next}
                    onClick={() => scrollShelf(1)}
                    disabled={!canScroll.next}
                  />
                </div>
              </div>

              <ul
                ref={shelfRef}
                className="-mx-5 mt-10 flex scroll-px-5 [scrollbar-width:none] gap-6 overflow-x-auto px-5 pt-6 pb-10 max-lg:snap-x max-lg:snap-mandatory sm:-mx-8 sm:scroll-px-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
              >
                {shelf.map((book, i) => (
                  <li
                    key={book.slug}
                    data-shelf-card
                    className="w-[72vw] max-w-[19rem] shrink-0 snap-start sm:w-[42vw] lg:w-[22rem]"
                  >
                    <Link
                      href={book.href}
                      className={cn(
                        "group block rounded-[1.75rem] p-5 transition-transform duration-500 ease-out hover:-translate-y-2 hover:rotate-0 sm:p-6",
                        i % 2 ? "rotate-[1.5deg]" : "rotate-[-1.5deg]",
                        panels[book.theme],
                      )}
                    >
                      <BookCover
                        title={book.title}
                        subtitle={book.subtitle}
                        author={author}
                        theme={book.theme}
                        cover={book.cover}
                        alt={coverAlt(copy, book)}
                        sizes="(min-width: 1024px) 300px, 60vw"
                        className="mx-auto w-[78%] transition-transform duration-500 ease-out group-hover:scale-[1.03] group-hover:-rotate-2"
                      />
                      <Tags tags={book.tags} className="mt-6" />
                      <p className="mt-3 font-heading text-2xl leading-tight font-bold tracking-tight">
                        {book.title}
                      </p>
                      <p className="mt-1 text-sm opacity-60">
                        {book.year} · {book.publisher}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function coverAlt(copy: Dictionary["books"], book: LocalizedBook) {
  return copy.coverAlt.replace("{title}", book.title);
}

/** Featured book drawn in 3D: front cover, page block on the right and spine on the left. */
function Book3D({ book, author, alt }: { book: LocalizedBook; author: string; alt: string }) {
  return (
    <div
      data-book-3d
      className="relative w-[min(62vw,19rem)] [transform:rotateY(-18deg)_rotateX(2deg)] [transform-style:preserve-3d] lg:w-[21rem]"
    >
      <BookCover
        title={book.title}
        subtitle={book.subtitle}
        author={author}
        theme={book.theme}
        cover={book.cover}
        alt={alt}
        sizes="340px"
        className="[transform:translateZ(1.25rem)]"
      />
      {/* Page block (right edge) */}
      <div
        aria-hidden
        className="absolute inset-y-[1.2%] right-0 w-10 [transform:translateX(1.25rem)_rotateY(90deg)] bg-[repeating-linear-gradient(90deg,#f5f5f0_0_2px,#d9d9d2_2px_3px)]"
      />
      {/* Spine (left edge) */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-10 [transform:translateX(-1.25rem)_rotateY(-90deg)] bg-[#24357a]"
      />
      {/* Back cover */}
      <div
        aria-hidden
        className="absolute inset-0 [transform:translateZ(-1.25rem)_rotateY(180deg)] rounded-sm bg-[#1c2c66]"
      />
    </div>
  );
}

function Tags({ tags, className }: { tags: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-current/25 px-3 py-1 font-mono text-[0.65rem] tracking-[0.12em] uppercase opacity-80"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

function ArrowButton({
  label,
  onClick,
  flip = false,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  flip?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className="grid size-12 place-items-center rounded-full border border-white/20 text-white transition-colors enabled:hover:border-brand-soft enabled:hover:bg-brand-soft enabled:hover:text-ink disabled:opacity-30"
    >
      <svg viewBox="0 0 20 20" className={cn("size-5", flip && "rotate-180")} fill="none">
        <path
          d="M4 10h12m0 0-5-5m5 5-5 5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

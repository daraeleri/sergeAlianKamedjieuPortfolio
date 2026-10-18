import { Plus } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type BookCardBook = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  cover?: string;
};

type BookCardProps = {
  book: BookCardBook;
  coverAlt: string;
  orderLabel: string;
  orderHref: Route;
  /** "lg" for the tall cards: bigger title, more room for the description. */
  size?: "md" | "lg";
  /** Fallback palette, alternated so neighbouring cards differ. */
  tone?: "tint" | "periwinkle";
  className?: string;
};

/**
 * One book in the bento. With a cover image: the cover fills the card, with a dark
 * gradient for the text. Without one: a light card with a big swoosh, a pill tag and the
 * title in large royal-blue type.
 */
export function BookCard({
  book,
  coverAlt,
  orderLabel,
  orderHref,
  size = "md",
  tone = "tint",
  className,
}: BookCardProps) {
  const [tag] = book.tags;
  const hasCover = Boolean(book.cover);

  return (
    <article
      className={cn(
        "group relative isolate flex min-h-[24rem] flex-col justify-end overflow-hidden rounded-[1.75rem] p-6 sm:p-7",
        hasCover
          ? "bg-ink text-white"
          : cn("text-ink ring-1 ring-brand/15", tone === "tint" ? "bg-brand-tint" : "bg-[#e2e8ff]"),
        className,
      )}
    >
      {book.cover ? (
        <>
          <Image
            src={book.cover}
            alt={coverAlt}
            fill
            sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
            className="-z-20 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/35 to-transparent"
          />
        </>
      ) : (
        <svg
          aria-hidden
          viewBox="0 0 300 420"
          className="absolute -top-4 -right-6 -z-10 w-[62%] max-w-[15rem] text-brand/15 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-rotate-3"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="34"
            strokeLinecap="butt"
            d="M190 0c-6 60 20 110 70 130-60 0-110 40-110 100 0 70 70 120 150 140M300 170c-90-20-170 10-180 80-10 70 60 120 110 140"
          />
        </svg>
      )}

      {tag ? (
        <p
          className={cn(
            "self-start rounded-full px-3.5 py-1.5 text-[0.7rem] font-semibold tracking-[0.16em] uppercase",
            hasCover ? "bg-white/15 text-white backdrop-blur" : "bg-brand/15 text-brand-strong",
          )}
        >
          {tag}
        </p>
      ) : null}

      <h3
        className={cn(
          "mt-4 font-heading leading-[1.05] font-bold tracking-tight text-balance",
          size === "lg" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
          !hasCover && "text-brand-strong",
        )}
      >
        {book.title}
      </h3>
      <p
        className={cn(
          "mt-3 max-w-sm text-sm leading-relaxed",
          size === "lg" ? "" : "line-clamp-3",
          hasCover ? "text-white/75" : "text-black/60",
        )}
      >
        {book.description}
      </p>

      <Link
        href={orderHref}
        className={cn(
          "mt-5 inline-flex items-center gap-1.5 self-start rounded-full px-4 py-2 text-sm font-semibold transition-colors",
          hasCover
            ? "bg-white text-ink hover:bg-brand-soft"
            : "bg-brand text-white hover:bg-brand-strong",
        )}
      >
        <Plus aria-hidden className="size-4" />
        {orderLabel}
        <span className="sr-only">: {book.title}</span>
      </Link>
    </article>
  );
}

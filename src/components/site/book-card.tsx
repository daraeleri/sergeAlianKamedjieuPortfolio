import { ArrowRight } from "lucide-react";
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
  /** Author line printed on the fallback cover. */
  author: string;
  /** Fallback cover palette, alternated so neighbouring books differ. */
  tone?: "brand" | "ink" | "light";
  className?: string;
};

const fallbackTones = {
  brand: "bg-brand text-white",
  ink: "bg-ink text-white",
  light: "bg-[#dfe6ff] text-brand-strong",
};

/**
 * One book on the shelf: the book stands on a light card (real cover, or a designed
 * fallback with the title), and the tag, title, summary and order link sit underneath.
 * On hover the book lifts and tilts slightly.
 */
export function BookCard({
  book,
  coverAlt,
  orderLabel,
  orderHref,
  author,
  tone = "brand",
  className,
}: BookCardProps) {
  const [tag] = book.tags;

  return (
    <article className={cn("group flex flex-col", className)}>
      <div className="grid aspect-[4/5] place-items-center overflow-hidden rounded-2xl bg-mist px-[18%] py-[12%]">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-l-[3px] rounded-r-md shadow-[0_24px_40px_-16px_rgb(10_10_10/0.45)] transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:-rotate-2">
          {book.cover ? (
            <Image
              src={book.cover}
              alt={coverAlt}
              fill
              sizes="(min-width: 1024px) 180px, (min-width: 640px) 30vw, 45vw"
              className="object-cover"
            />
          ) : (
            <div
              role="img"
              aria-label={coverAlt}
              className={cn(
                "relative isolate flex h-full flex-col justify-between overflow-hidden p-[9%]",
                fallbackTones[tone],
              )}
            >
              <svg
                aria-hidden
                viewBox="0 0 400 400"
                className="absolute -right-[30%] -bottom-[20%] -z-10 w-[110%] opacity-20"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="46"
                  strokeLinecap="round"
                  d="M40 330C80 220 170 250 210 170s-30-130 40-130 120 90 70 170"
                />
              </svg>
              <span className="text-[0.55rem] font-semibold tracking-[0.18em] uppercase opacity-70">
                {author}
              </span>
              <span className="font-heading text-[clamp(0.8rem,1.6vw,1.05rem)] leading-tight font-semibold text-balance">
                {book.title}
              </span>
            </div>
          )}
          {/* Spine shading */}
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-[7%] bg-gradient-to-r from-black/25 to-transparent"
          />
        </div>
      </div>

      {tag ? (
        <p className="mt-4 text-[0.7rem] font-semibold tracking-[0.14em] text-brand-strong uppercase">
          {tag}
        </p>
      ) : null}
      <h3 className="mt-1.5 font-heading text-lg leading-snug font-semibold tracking-tight text-balance">
        {book.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-black/55">
        {book.description}
      </p>
      <Link
        href={orderHref}
        className="group/link mt-3 inline-flex items-center gap-1.5 self-start text-sm font-medium text-ink underline decoration-black/15 underline-offset-4 transition-colors hover:text-brand-strong hover:decoration-brand"
      >
        {orderLabel}
        <span className="sr-only">: {book.title}</span>
        <ArrowRight
          aria-hidden
          className="size-3.5 transition-transform group-hover/link:translate-x-0.5"
        />
      </Link>
    </article>
  );
}

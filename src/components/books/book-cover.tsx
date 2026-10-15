import Image from "next/image";
import type { Book } from "@/content/books";
import { cn } from "@/lib/utils";

type BookCoverProps = {
  title: string;
  subtitle: string;
  author: string;
  theme: Book["theme"];
  cover?: string;
  alt: string;
  sizes?: string;
  className?: string;
};

const themes: Record<Book["theme"], { bg: string; text: string; accent: string; rule: string }> = {
  royal: { bg: "bg-brand", text: "text-white", accent: "text-white/70", rule: "bg-white/40" },
  ink: { bg: "bg-ink", text: "text-white", accent: "text-brand-soft", rule: "bg-brand-soft/60" },
  paper: { bg: "bg-[#f3efe6]", text: "text-ink", accent: "text-brand-strong", rule: "bg-brand/50" },
  sky: { bg: "bg-brand-soft", text: "text-ink", accent: "text-ink/70", rule: "bg-ink/30" },
};

/**
 * A 2:3 book cover. Uses the real cover image when there is one, otherwise draws a
 * typographic cover in the brand colours. Includes a subtle spine shade on the left.
 */
export function BookCover({
  title,
  subtitle,
  author,
  theme,
  cover,
  alt,
  sizes = "240px",
  className,
}: BookCoverProps) {
  const t = themes[theme];

  return (
    <div
      className={cn(
        "@container relative aspect-[2/3] overflow-hidden rounded-l-sm rounded-r-md shadow-[0_24px_50px_-20px_rgb(0_0_0/0.55)]",
        t.bg,
        className,
      )}
    >
      {cover ? (
        <Image src={cover} alt={alt} fill sizes={sizes} className="object-cover" />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className={cn("flex h-full flex-col justify-between p-[9%]", t.text)}
        >
          <CrownMark className={cn("h-[9%] w-auto self-start", t.accent)} />
          <div>
            <span aria-hidden className={cn("mb-[8%] block h-px w-1/3", t.rule)} />
            <p className="font-heading text-[12.5cqw] leading-[0.95] font-bold tracking-tight">
              {title}
            </p>
            <p className={cn("mt-[6%] text-[5.2cqw] leading-snug", t.accent)}>{subtitle}</p>
          </div>
          <p className="font-mono text-[3.8cqw] tracking-[0.18em] uppercase opacity-80">{author}</p>
        </div>
      )}
      {/* Spine shade and page-edge highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-[7%] bg-gradient-to-r from-black/35 via-black/10 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-[7%] w-px bg-white/25"
      />
    </div>
  );
}

function CrownMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 40 28" fill="none" className={className}>
      <path
        d="M3 24h34M5 20 3 6l10 7 7-11 7 11 10-7-2 14H5Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

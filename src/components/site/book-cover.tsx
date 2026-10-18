import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type CoverTheme = "royal" | "ink" | "paper" | "sky";

const themes: Record<CoverTheme, { bg: string; text: string; accent: string; rule: string }> = {
  royal: { bg: "bg-brand", text: "text-white", accent: "text-white/75", rule: "bg-white/40" },
  ink: { bg: "bg-ink", text: "text-white", accent: "text-brand-soft", rule: "bg-brand-soft/60" },
  paper: { bg: "bg-[#f6f3ec]", text: "text-ink", accent: "text-brand-strong", rule: "bg-brand/50" },
  sky: { bg: "bg-[#dfe7ff]", text: "text-ink", accent: "text-brand-strong", rule: "bg-brand/40" },
};

type BookCoverProps = {
  title: string;
  author: string;
  icon: LucideIcon;
  theme: CoverTheme;
  alt: string;
  className?: string;
};

/**
 * Typographic 2:3 book cover drawn in the brand colours, with a spine shade. A stand-in
 * until real cover images are added; text sizes scale with the cover's own width.
 */
export function BookCover({ title, author, icon: Icon, theme, alt, className }: BookCoverProps) {
  const t = themes[theme];
  const long = title.length > 40;

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "@container relative aspect-[2/3] overflow-hidden rounded-l-sm rounded-r-md shadow-[0_28px_50px_-20px_rgb(0_0_0/0.55)]",
        t.bg,
        className,
      )}
    >
      <div aria-hidden className={cn("flex h-full flex-col justify-between p-[10%]", t.text)}>
        <Icon strokeWidth={1.75} className={cn("size-[16cqw]", t.accent)} />
        <div>
          <span className={cn("mb-[8%] block h-px w-1/3", t.rule)} />
          <p
            className={cn(
              "font-heading leading-[1.02] font-bold tracking-tight text-balance",
              long ? "text-[9.5cqw]" : "text-[12cqw]",
            )}
          >
            {title}
          </p>
        </div>
        <p className="text-[4.4cqw] font-medium tracking-[0.14em] uppercase opacity-80">{author}</p>
      </div>
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

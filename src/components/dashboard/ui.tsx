import { ArrowDownRight, ArrowUpRight, BookOpen, FileText } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { articleThemes } from "@/components/site/article-card";
import type { ArticleTheme } from "@/content/articles";
import type { ContentStatus } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

/** White dashboard card with an optional title row. */
export function Card({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-2xl bg-white ring-1 ring-black/5", className)}>
      {title ? (
        <div className="flex items-start justify-between gap-4 px-5 pt-5">
          <div>
            <h2 className="text-sm font-semibold">{title}</h2>
            {description ? <p className="mt-0.5 text-xs text-black/50">{description}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

const statusStyles: Record<ContentStatus, string> = {
  idea: "bg-black/5 text-black/60",
  draft: "bg-amber-50 text-amber-700 ring-amber-600/15",
  review: "bg-violet-50 text-violet-700 ring-violet-600/15",
  scheduled: "bg-sky-50 text-sky-700 ring-sky-600/15",
  published: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
};

const statusDots: Record<ContentStatus, string> = {
  idea: "bg-black/35",
  draft: "bg-amber-500",
  review: "bg-violet-500",
  scheduled: "bg-sky-500",
  published: "bg-emerald-500",
};

export function StatusBadge({ status, label }: { status: ContentStatus; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-transparent",
        statusStyles[status],
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", statusDots[status])} />
      {label}
    </span>
  );
}

export function StatusDot({ status }: { status: ContentStatus }) {
  return <span aria-hidden className={cn("size-2 rounded-full", statusDots[status])} />;
}

/** Publish progress bar; turns green when complete. */
export function ProgressBar({
  percent,
  label,
  className,
}: {
  percent: number;
  /** Accessible label, e.g. "Publish progress". */
  label: string;
  className?: string;
}) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-black/[0.07]", className)}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500 ease-out",
          percent === 100 ? "bg-emerald-500" : percent >= 60 ? "bg-brand" : "bg-brand-soft",
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

/** Change against the previous period, e.g. "+12.1%". */
export function Delta({
  value,
  previous,
  label,
}: {
  value: number;
  previous: number;
  label: string;
}) {
  const change = previous ? ((value - previous) / previous) * 100 : 0;
  const up = change >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <p className="flex items-center gap-1.5 text-xs text-black/45">
      <span
        className={cn(
          "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold",
          up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700",
        )}
      >
        <Icon aria-hidden className="size-3" />
        {up ? "+" : ""}
        {change.toFixed(1)}%
      </span>
      {label}
    </p>
  );
}

/** Row of thin vertical bars (mini chart in KPI cards). */
export function Sparkbars({
  series,
  tone = "brand",
}: {
  series: number[];
  tone?: "brand" | "ink" | "amber" | "emerald";
}) {
  const max = Math.max(...series, 1);
  const colors = {
    brand: "bg-brand",
    ink: "bg-ink",
    amber: "bg-amber-400",
    emerald: "bg-emerald-500",
  };
  return (
    <div aria-hidden className="flex h-10 items-end gap-[3px]">
      {series.map((value, i) => (
        <span
          key={i}
          className={cn(
            "w-1.5 rounded-full",
            i === series.length - 1 ? colors[tone] : "bg-black/10",
          )}
          style={{ height: `${Math.max(12, (value / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

/** Small cover for lists: the image, the article's themed design, or a book placeholder. */
export function ContentThumb({
  cover,
  kind,
  className,
}: {
  cover?: string;
  kind: "article" | "book";
  className?: string;
}) {
  if (cover?.startsWith("theme:")) {
    const theme = articleThemes[cover.slice(6) as ArticleTheme] ?? articleThemes.spirit;
    return (
      <span
        aria-hidden
        className={cn(
          "relative grid shrink-0 place-items-center overflow-hidden rounded-lg text-white",
          theme.className,
          className,
        )}
      >
        <theme.icon strokeWidth={1.5} className="size-1/2 opacity-70" />
      </span>
    );
  }
  if (cover) {
    return (
      <span
        aria-hidden
        className={cn("relative shrink-0 overflow-hidden rounded-lg bg-mist", className)}
      >
        <Image src={cover} alt="" fill sizes="96px" className="object-cover" />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-lg border border-dashed border-black/15 bg-mist text-black/30",
        className,
      )}
    >
      {kind === "book" ? (
        <BookOpen strokeWidth={1.5} className="size-1/2" />
      ) : (
        <FileText strokeWidth={1.5} className="size-1/2" />
      )}
    </span>
  );
}

/** "{percent}% ready"-style replacement helper. */
export function fill(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

/** Loading placeholder for the editors while the page reads its URL. */
export function EditorSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="mb-6 h-9 w-40 rounded-lg bg-black/5" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <div className="aspect-[21/9] rounded-2xl bg-black/5" />
          <div className="h-10 w-3/4 rounded-lg bg-black/5" />
          <div className="h-24 rounded-2xl bg-black/5" />
        </div>
        <div className="h-96 rounded-2xl bg-black/5" />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Point = { label: string; value: number; secondary?: number };

/** Number formatter for chart labels: compact from 10,000 ("12 k"). */
function formatter(locale: string) {
  const plain = new Intl.NumberFormat(locale);
  const compact = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 });
  return (value: number) => (value >= 10000 ? compact : plain).format(value);
}

/** Rounds a maximum up to a tidy axis value (1, 2, 2.5 or 5 times a power of ten). */
function niceMax(max: number) {
  const power = 10 ** Math.floor(Math.log10(Math.max(max, 1)));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * power >= max) ?? 10;
  return step * power;
}

/**
 * Monthly bar chart (reference 4): light bars with the highlighted bar in royal blue and a
 * value bubble on hover or focus. Keyboard and screen-reader friendly: each bar is a
 * focusable item with its label and value.
 */
export function BarChart({
  data,
  highlight = data.length - 1,
  locale,
  label,
}: {
  data: Point[];
  highlight?: number;
  /** Locale for number formatting, e.g. "fr". */
  locale: string;
  /** Accessible name of the chart. */
  label: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const format = formatter(locale);
  const max = niceMax(Math.max(...data.map((point) => point.value)));
  const ticks = [1, 0.75, 0.5, 0.25, 0].map((ratio) => ratio * max);
  const shown = active ?? highlight;

  return (
    <div role="group" aria-label={label} className="flex gap-3">
      {/* Y axis */}
      <div
        aria-hidden
        className="flex h-56 flex-col justify-between pb-6 text-right text-[0.7rem] text-black/35 tabular-nums"
      >
        {ticks.map((tick) => (
          <span key={tick} className="-translate-y-1/2 leading-none">
            {format(tick)}
          </span>
        ))}
      </div>
      <div className="relative flex-1">
        {/* Grid */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between"
        >
          {ticks.map((tick) => (
            <span key={tick} className="border-t border-dashed border-black/[0.07]" />
          ))}
        </div>
        <ul className="relative flex h-56 items-end gap-1.5 sm:gap-2.5">
          {data.map((point, i) => {
            const isShown = i === shown;
            return (
              <li
                key={point.label}
                className="flex h-full flex-1 flex-col items-center justify-end"
              >
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  aria-label={`${point.label}: ${format(point.value)}`}
                  className="group relative flex h-[calc(100%-1.5rem)] w-full items-end focus-visible:outline-none"
                >
                  {isShown ? (
                    <span
                      className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 -translate-y-full rounded-md bg-ink px-2 py-1 text-[0.7rem] font-semibold whitespace-nowrap text-white"
                      style={{ bottom: `${(point.value / max) * 100}%`, marginBottom: 6 }}
                    >
                      {format(point.value)}
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      "w-full rounded-md transition-colors duration-200 group-focus-visible:ring-2 group-focus-visible:ring-brand/40",
                      i === highlight
                        ? "bg-gradient-to-t from-brand to-brand-soft"
                        : isShown
                          ? "bg-brand-soft/60"
                          : "bg-gradient-to-t from-black/[0.08] to-black/[0.03]",
                    )}
                    style={{ height: `${Math.max(2, (point.value / max) * 100)}%` }}
                  />
                </button>
                <span
                  aria-hidden
                  className={cn(
                    "mt-2 h-4 text-[0.7rem]",
                    isShown ? "font-semibold text-ink" : "text-black/40",
                  )}
                >
                  {point.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/**
 * Pixel chart (reference 2): each month is a column of small squares, filled for article
 * reads (royal blue) and page views (light), giving a dot-matrix look.
 */
export function PixelChart({
  data,
  rows = 16,
  locale,
  label,
  legend,
}: {
  data: Point[];
  rows?: number;
  /** Locale for number formatting, e.g. "fr". */
  locale: string;
  label: string;
  legend: { primary: string; secondary: string };
}) {
  const [active, setActive] = useState<number | null>(null);
  const format = formatter(locale);
  const max = Math.max(...data.map((point) => point.value));
  const shown = active ?? data.length - 1;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-black/55">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="size-2.5 rounded-[3px] bg-black/[0.07]" />
          {legend.primary}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="size-2.5 rounded-[3px] bg-brand" />
          {legend.secondary}
        </span>
      </div>
      <ul role="group" aria-label={label} className="flex items-end gap-1 sm:gap-1.5">
        {data.map((point, i) => {
          const filled = Math.round((point.value / max) * rows);
          const strong = Math.round(((point.secondary ?? 0) / max) * rows);
          const isShown = i === shown;
          return (
            <li key={point.label} className="flex flex-1 flex-col items-center">
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                aria-label={`${point.label}: ${legend.primary} ${format(point.value)}, ${legend.secondary} ${format(point.secondary ?? 0)}`}
                className="relative grid w-full grid-cols-3 gap-[3px] rounded-md focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
              >
                {/* Three thin columns per month (with a slight weekly variation), filled
                    from the bottom: reads in royal blue, views in light blue. */}
                {Array.from({ length: rows }, (_, r) => rows - 1 - r).flatMap((row) =>
                  [-1, 0, 1].map((offset, col) => {
                    const shift = (i + col) % 2 ? offset : -offset;
                    const isStrong = row < Math.max(0, strong + shift);
                    const isFilled = row < Math.max(1, filled + shift);
                    return (
                      <span
                        key={`${row}-${col}`}
                        className={cn(
                          "aspect-square w-full rounded-[2px] transition-colors",
                          isStrong
                            ? isShown
                              ? "bg-brand"
                              : "bg-brand/80"
                            : isFilled
                              ? isShown
                                ? "bg-brand-soft/45"
                                : "bg-black/[0.07]"
                              : "bg-transparent",
                        )}
                      />
                    );
                  }),
                )}
                {isShown ? (
                  <span
                    className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 rounded-lg bg-white px-2.5 py-1.5 text-left text-[0.7rem] whitespace-nowrap shadow-lg ring-1 ring-black/5"
                    style={{ bottom: `calc(${(filled / rows) * 100}% + 8px)` }}
                  >
                    <span className="block font-semibold text-ink">{point.label}</span>
                    <span className="block text-black/55">
                      {legend.primary}: <b className="text-ink">{format(point.value)}</b>
                    </span>
                    <span className="block text-black/55">
                      {legend.secondary}:{" "}
                      <b className="text-brand-strong">{format(point.secondary ?? 0)}</b>
                    </span>
                  </span>
                ) : null}
              </button>
              <span
                aria-hidden
                className={cn(
                  "mt-2 text-[0.65rem]",
                  isShown ? "font-semibold text-ink" : "text-black/40",
                )}
              >
                {point.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

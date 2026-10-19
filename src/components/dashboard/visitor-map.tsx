"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { mapPosition, worldDots } from "@/lib/dashboard/world-dots";

export type MapCountry = {
  code: string;
  name: string;
  visitors: number;
  lat: number;
  lng: number;
  topCity?: string;
};

export type MapCity = { name: string; visitors: number; lat: number; lng: number };

export type MapPanelTab = {
  key: string;
  label: string;
  rows: { label: string; badge?: string; value: number }[];
};

type LiveEvent = { id: number; city: string; page: string; left: number; top: number };

export type VisitorMapCopy = {
  readingNow: string;
  visitors: string;
  ofVisitors: string;
  topCity: string;
  live: string;
  liveEmpty: string;
  liveEvent: string;
  justNow: string;
  countries: string;
};

const COLS = worldDots[0].length;
const ROWS = worldDots.length;
const LIVE_EVERY_MS = 3200;

/** Dotted world map with a numbered pin per country and a simulated live feed. */
export function VisitorMap({
  locale,
  countries,
  cities,
  livePages,
  tabs,
  copy,
}: {
  locale: string;
  countries: MapCountry[];
  cities: MapCity[];
  livePages: string[];
  tabs: MapPanelTab[];
  copy: VisitorMapCopy;
}) {
  const number = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const compact = useMemo(
    () => new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }),
    [locale],
  );
  const total = countries.reduce((sum, country) => sum + country.visitors, 0);
  const max = Math.max(...countries.map((country) => country.visitors));

  const [active, setActive] = useState<string | null>(null);
  const [tab, setTab] = useState("live");
  const [readingNow, setReadingNow] = useState(14);
  const [events, setEvents] = useState<LiveEvent[]>([]);

  const dots = useMemo(() => landDots(countries, max), [countries, max]);

  // Simulated realtime: a new reader appears in a city every few seconds. Replace with a
  // live feed (WebSocket or polling) once visits are recorded in the database.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const weights = cities.reduce((sum, city) => sum + city.visitors, 0);
    let id = 0;
    const timer = window.setInterval(() => {
      let pick = Math.random() * weights;
      const city = cities.find((item) => (pick -= item.visitors) <= 0) ?? cities[0];
      const page = livePages[Math.floor(Math.random() * livePages.length)];
      const event = { id: ++id, city: city.name, page, ...mapPosition(city.lat, city.lng) };
      setEvents((current) => [event, ...current].slice(0, 4));
      setReadingNow((current) =>
        Math.min(24, Math.max(6, current + Math.round(Math.random() * 4 - 1.6))),
      );
    }, LIVE_EVERY_MS);
    return () => window.clearInterval(timer);
  }, [cities, livePages]);

  const panelTabs = [{ key: "live", label: copy.live, rows: [] }, ...tabs];
  const current = panelTabs.find((item) => item.key === tab) ?? panelTabs[0];
  const tabMax = Math.max(1, ...current.rows.map((row) => row.value));

  return (
    <div className="grid items-center gap-4 xl:grid-cols-[minmax(0,1fr)_17rem]">
      {/* Pins are sized against the map width (cqw), so the map reads the same at any size. */}
      <div className="relative aspect-[120/45] w-full" style={{ containerType: "inline-size" }}>
        <svg
          viewBox={`0 0 ${COLS} ${ROWS}`}
          className="absolute inset-0 size-full"
          aria-hidden
          preserveAspectRatio="none"
        >
          {dots.map((dot) => (
            <circle
              key={dot.key}
              cx={dot.x}
              cy={dot.y}
              r={0.34}
              className={dot.heat ? "fill-brand" : "fill-black/[0.13]"}
              fillOpacity={dot.heat || undefined}
            />
          ))}
        </svg>

        {events.map((event) => (
          <span
            key={event.id}
            aria-hidden
            className="pointer-events-none absolute size-3 -translate-1/2"
            style={{ left: `${event.left}%`, top: `${event.top}%` }}
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
            <span className="absolute inset-0.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </span>
        ))}

        {[...countries]
          // Smallest first, so the biggest pins and their numbers sit on top.
          .sort((a, b) => a.visitors - b.visitors)
          .map((country, index, sorted) => {
            const { left, top } = mapPosition(country.lat, country.lng);
            // Diameter at a 1000px-wide map.
            const size = Math.round(14 + 28 * Math.sqrt(country.visitors / max));
            const isActive = active === country.code;
            const share = Math.round((country.visitors / total) * 100);
            return (
              <div
                key={country.code}
                className={cn("absolute -translate-1/2", isActive ? "z-30" : "z-10")}
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                {index === sorted.length - 1 ? (
                  <span
                    aria-hidden
                    className="absolute inset-0 animate-ping rounded-full bg-brand/30 [animation-duration:2.4s]"
                  />
                ) : null}
                <button
                  type="button"
                  onMouseEnter={() => setActive(country.code)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(country.code)}
                  onBlur={() => setActive(null)}
                  aria-label={`${country.name}: ${number.format(country.visitors)} ${copy.visitors}`}
                  className={cn(
                    "relative grid place-items-center rounded-full bg-brand font-semibold text-white shadow-[0_4px_14px_-4px] ring-2 shadow-brand/60 ring-white transition-transform duration-200 outline-none focus-visible:ring-black",
                    isActive && "scale-115",
                  )}
                  style={{
                    width: `max(9px, ${size / 10}cqw)`,
                    height: `max(9px, ${size / 10}cqw)`,
                  }}
                >
                  {size >= 26 ? (
                    <span className="hidden text-[max(7px,1cqw)] leading-none tabular-nums sm:inline">
                      {compact.format(country.visitors)}
                    </span>
                  ) : null}
                </button>
                {isActive ? (
                  <div
                    role="tooltip"
                    className={cn(
                      "pointer-events-none absolute left-1/2 w-44 -translate-x-1/2 rounded-xl bg-ink px-3 py-2.5 text-white shadow-xl",
                      top < 30 ? "top-full mt-2" : "bottom-full mb-2",
                    )}
                  >
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <span className="rounded bg-white/15 px-1 text-[10px]">{country.code}</span>
                      {country.name}
                    </p>
                    <p className="mt-1 font-heading text-xl font-semibold tabular-nums">
                      {number.format(country.visitors)}
                      <span className="ml-1 text-xs font-normal text-white/55">
                        {copy.visitors}
                      </span>
                    </p>
                    <p className="text-xs text-white/55">
                      {copy.ofVisitors.replace("{percent}", String(share))}
                      {country.topCity ? ` · ${copy.topCity} ${country.topCity}` : ""}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}

        <div className="absolute -top-1 right-0 z-40 flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-1 text-[10px] font-medium ring-1 ring-black/5 backdrop-blur sm:top-0 sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400" />
            <span className="relative size-2 rounded-full bg-emerald-500" />
          </span>
          <span aria-live="polite" className="tabular-nums">
            {copy.readingNow.replace("{count}", String(readingNow))}
          </span>
        </div>
      </div>

      <div className="w-full rounded-2xl bg-ink p-2 text-white shadow-xl shadow-black/15">
        <div role="tablist" className="flex gap-1 rounded-xl bg-white/[0.06] p-1">
          {panelTabs.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={item.key === current.key}
              onClick={() => setTab(item.key)}
              className={cn(
                "flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                item.key === current.key
                  ? "bg-white text-ink"
                  : "text-white/60 hover:bg-white/10 hover:text-white",
              )}
            >
              {item.key === "live" ? (
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden className="size-1.5 rounded-full bg-emerald-400" />
                  {item.label}
                </span>
              ) : (
                item.label
              )}
            </button>
          ))}
        </div>

        <ul role="tabpanel" className="mt-1 min-h-40 space-y-0.5">
          {current.key === "live" ? (
            events.length ? (
              events.map((event) => (
                <li
                  key={event.id}
                  className="flex animate-fade-up items-start gap-2.5 rounded-lg px-2.5 py-2 text-xs"
                >
                  <span
                    aria-hidden
                    className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-400"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-1 text-white/85">
                      {copy.liveEvent.replace("{city}", event.city)}
                    </span>
                    <span className="line-clamp-1 text-white/45">{event.page}</span>
                  </span>
                  <span className="shrink-0 text-white/35">{copy.justNow}</span>
                </li>
              ))
            ) : (
              <li className="px-2.5 py-6 text-center text-xs text-white/45">{copy.liveEmpty}</li>
            )
          ) : (
            current.rows.slice(0, 5).map((row) => (
              <li
                key={row.label}
                onMouseEnter={() => row.badge && setActive(row.badge)}
                onMouseLeave={() => setActive(null)}
                className="relative flex items-center gap-2.5 overflow-hidden rounded-lg px-2.5 py-1.5 text-xs"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 rounded-lg bg-white/[0.07]"
                  style={{ width: `${(row.value / tabMax) * 100}%` }}
                />
                {row.badge ? (
                  <span className="relative rounded bg-white/15 px-1 text-[10px] font-semibold">
                    {row.badge}
                  </span>
                ) : null}
                <span className="relative min-w-0 flex-1 truncate">{row.label}</span>
                <span className="relative text-white/70 tabular-nums">
                  {number.format(row.value)}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

/** Land dots, tinted in the brand colour around the countries visitors come from. */
function landDots(countries: MapCountry[], max: number) {
  const centres = countries.map((country) => {
    const { left, top } = mapPosition(country.lat, country.lng);
    return { x: (left / 100) * COLS, y: (top / 100) * ROWS, visitors: country.visitors };
  });
  const scale = Math.log10(1 + max);
  const dots: { key: string; x: number; y: number; heat: number }[] = [];
  worldDots.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== "#") continue;
      const cx = x + 0.5;
      const cy = y + 0.5;
      let glow = 0;
      for (const centre of centres) {
        const distance = (centre.x - cx) ** 2 + (centre.y - cy) ** 2;
        glow += centre.visitors * Math.exp(-distance / 6);
      }
      const intensity = Math.log10(1 + glow) / scale;
      const heat = intensity > 0.4 ? Math.round((0.2 + 0.8 * intensity ** 2) * 100) / 100 : 0;
      dots.push({ key: `${x}-${y}`, x: cx, y: cy, heat });
    }
  });
  return dots;
}

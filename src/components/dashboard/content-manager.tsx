"use client";

import { Columns3, Eye, Rows3, Search, Share2, ShoppingBag } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import { ContentThumb, ProgressBar, StatusBadge, StatusDot } from "@/components/dashboard/ui";
import type { Dictionary } from "@/i18n/get-dictionary";
import { contentStatuses, type ContentStatus } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

/** One row of the articles or books list, prepared on the server. */
export type ContentRow = {
  id: string;
  href: Route;
  title: string;
  subtitle: string;
  status: ContentStatus;
  cover?: string;
  percent: number;
  /** Views and shares (articles) or views and order requests (books). */
  views: number;
  second: number;
  updatedLabel: string;
};

type Copy = Dictionary["dashboard"];

/**
 * Articles or books list with status filters, search and two views (reference 1):
 * a table, and a board with one column per status. Every row shows its publish progress.
 */
export function ContentManager({
  rows,
  kind,
  copy,
  locale,
}: {
  rows: ContentRow[];
  kind: "article" | "book";
  copy: Copy;
  locale: string;
}) {
  const [view, setView] = useState<"table" | "board">("table");
  const [status, setStatus] = useState<ContentStatus | "all">("all");
  const [query, setQuery] = useState("");
  const number = new Intl.NumberFormat(locale);
  const SecondIcon = kind === "article" ? Share2 : ShoppingBag;
  const secondLabel = kind === "article" ? copy.common.shares : copy.books.orders;

  const term = query.trim().toLowerCase();
  const searched = term
    ? rows.filter((row) => `${row.title} ${row.subtitle}`.toLowerCase().includes(term))
    : rows;
  const visible = status === "all" ? searched : searched.filter((row) => row.status === status);
  const count = (value: ContentStatus | "all") =>
    value === "all" ? searched.length : searched.filter((row) => row.status === value).length;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label={copy.common.status}
          className="-mx-1 flex [scrollbar-width:none] gap-1 overflow-x-auto px-1"
        >
          {(["all", ...contentStatuses] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={status === value}
              onClick={() => setStatus(value)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                status === value
                  ? "bg-white text-ink shadow-sm ring-1 ring-black/5"
                  : "text-black/55 hover:text-ink",
              )}
            >
              {value === "all" ? copy.common.all : copy.status[value]}
              <span className="rounded-md bg-black/5 px-1.5 text-xs tabular-nums">
                {count(value)}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="relative flex-1 lg:w-64 lg:flex-none">
            <span className="sr-only">
              {kind === "article" ? copy.articles.search : copy.books.search}
            </span>
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-black/35"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={kind === "article" ? copy.articles.search : copy.books.search}
              className="w-full rounded-lg bg-white py-2 pr-3 pl-9 text-sm ring-1 ring-black/10 outline-none placeholder:text-black/35 focus:ring-2 focus:ring-brand/40"
            />
          </label>
          <div className="flex rounded-lg bg-white p-0.5 ring-1 ring-black/10">
            {(
              [
                ["table", Rows3, copy.common.table],
                ["board", Columns3, copy.common.board],
              ] as const
            ).map(([value, Icon, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setView(value)}
                aria-pressed={view === value}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                  view === value ? "bg-ink text-white" : "text-black/55 hover:text-ink",
                )}
              >
                <Icon aria-hidden className="size-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === "table" ? (
        <div className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] text-sm">
              <thead>
                <tr className="border-b border-black/5 bg-mist/60 text-left text-xs text-black/45">
                  <th className="min-w-[17rem] px-5 py-3 font-medium">
                    {kind === "article" ? copy.articles.columns.title : copy.nav.books}
                  </th>
                  <th className="px-3 py-3 font-medium">{copy.articles.columns.status}</th>
                  <th className="w-48 px-3 py-3 font-medium">{copy.articles.columns.progress}</th>
                  <th className="px-3 py-3 text-right font-medium">{copy.common.views}</th>
                  <th className="px-3 py-3 text-right font-medium">{secondLabel}</th>
                  <th className="px-5 py-3 text-right font-medium">
                    {copy.articles.columns.updated}
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr
                    key={row.id}
                    className="group border-b border-black/5 last:border-0 hover:bg-mist/50"
                  >
                    <td className="px-5 py-3">
                      <Link href={row.href} className="flex items-center gap-3">
                        <ContentThumb
                          cover={row.cover}
                          kind={kind}
                          className={kind === "book" ? "h-12 w-9" : "size-10"}
                        />
                        <span className="min-w-0">
                          <span className="line-clamp-1 font-medium group-hover:text-brand-strong">
                            {row.title}
                          </span>
                          <span className="line-clamp-1 text-xs text-black/45">{row.subtitle}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={row.status} label={copy.status[row.status]} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <ProgressBar percent={row.percent} label={copy.common.progress} />
                        <span className="w-9 shrink-0 text-right text-xs font-semibold text-black/55 tabular-nums">
                          {row.percent}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {row.views ? number.format(row.views) : "—"}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {row.second ? number.format(row.second) : "—"}
                    </td>
                    <td className="px-5 py-3 text-right text-xs whitespace-nowrap text-black/50">
                      {row.updatedLabel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {visible.length === 0 ? (
            <p className="p-8 text-center text-sm text-black/45">{copy.common.noResults}</p>
          ) : null}
        </div>
      ) : (
        <div className="-mx-4 mt-4 flex items-start gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          {contentStatuses
            .filter((value) => status === "all" || value === status)
            .map((value) => {
              const items = visible.filter((row) => row.status === value);
              return (
                <section
                  key={value}
                  className="w-72 shrink-0 rounded-2xl bg-black/[0.03] p-2 xl:flex-1"
                >
                  <h2 className="flex items-center gap-2 px-2 py-2 text-sm font-semibold">
                    <StatusDot status={value} />
                    {copy.status[value]}
                    <span className="text-xs font-medium text-black/40">{items.length}</span>
                  </h2>
                  <ul className="space-y-2">
                    {items.map((row) => (
                      <li key={row.id}>
                        <Link
                          href={row.href}
                          className="block rounded-xl bg-white p-3 ring-1 ring-black/5 transition-shadow hover:shadow-md"
                        >
                          <div className="flex gap-3">
                            <ContentThumb
                              cover={row.cover}
                              kind={kind}
                              className={kind === "book" ? "h-12 w-9" : "size-9"}
                            />
                            <div className="min-w-0">
                              <p className="line-clamp-2 text-sm leading-snug font-medium">
                                {row.title}
                              </p>
                              <p className="mt-0.5 text-xs text-black/45">{row.updatedLabel}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <ProgressBar percent={row.percent} label={copy.common.progress} />
                            <span className="text-xs font-semibold text-black/55 tabular-nums">
                              {row.percent}%
                            </span>
                          </div>
                          {row.views ? (
                            <p className="mt-2.5 flex items-center gap-3 text-xs text-black/50">
                              <span className="inline-flex items-center gap-1">
                                <Eye aria-hidden className="size-3.5" />
                                {number.format(row.views)}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <SecondIcon aria-hidden className="size-3.5" />
                                {number.format(row.second)}
                              </span>
                            </p>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                    {items.length === 0 ? (
                      <li className="rounded-xl border border-dashed border-black/10 p-4 text-center text-xs text-black/35">
                        —
                      </li>
                    ) : null}
                  </ul>
                </section>
              );
            })}
        </div>
      )}
    </div>
  );
}

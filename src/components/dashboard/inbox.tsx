"use client";

import { ArrowLeft, Building2, Mail, MailOpen } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { fill } from "@/components/dashboard/ui";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { InboxMessage, MessageType } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

const typeStyles: Record<MessageType, string> = {
  invitation: "bg-brand-tint text-brand-strong",
  books: "bg-amber-50 text-amber-700",
  prayer: "bg-violet-50 text-violet-700",
  other: "bg-black/5 text-black/60",
};

/**
 * Two-pane inbox for contact form messages: list with All / Unread filter on the left,
 * the selected message on the right (full screen on phones). Read state is local until
 * the database is connected.
 */
export function Inbox({
  messages,
  copy,
  types,
  locale,
}: {
  messages: InboxMessage[];
  copy: Dictionary["dashboard"]["messages"];
  types: Dictionary["contact"]["form"]["types"];
  locale: string;
}) {
  const params = useSearchParams();
  const [selected, setSelected] = useState<string | null>(params.get("id"));
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [read, setRead] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      messages.map((message) => [message.id, message.read || message.id === params.get("id")]),
    ),
  );
  const date = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });
  const full = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "short" });

  const visible = filter === "unread" ? messages.filter((message) => !read[message.id]) : messages;
  const current = messages.find((message) => message.id === selected);
  const unreadCount = messages.filter((message) => !read[message.id]).length;

  const open = (id: string) => {
    setSelected(id);
    setRead((state) => ({ ...state, [id]: true }));
  };

  return (
    <div className="grid overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 lg:h-[calc(100svh-15rem)] lg:min-h-[32rem] lg:grid-cols-[22rem_minmax(0,1fr)]">
      {/* List */}
      <div
        className={cn(
          "flex min-h-0 flex-col border-black/5 lg:border-r",
          current && "hidden lg:flex",
        )}
      >
        <div className="flex gap-1 border-b border-black/5 p-2">
          {(["all", "unread"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium",
                filter === value ? "bg-mist text-ink" : "text-black/55 hover:text-ink",
              )}
            >
              {copy[value]}
              {value === "unread" ? (
                <span className="rounded-md bg-brand px-1.5 text-xs text-white tabular-nums">
                  {unreadCount}
                </span>
              ) : null}
            </button>
          ))}
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto">
          {visible.map((message) => (
            <li key={message.id}>
              <button
                type="button"
                onClick={() => open(message.id)}
                aria-current={message.id === selected ? "true" : undefined}
                className={cn(
                  "flex w-full gap-3 border-b border-black/5 px-4 py-3.5 text-left transition-colors hover:bg-mist/60",
                  message.id === selected && "bg-brand-tint/60",
                )}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist text-sm font-semibold text-black/60">
                  {message.name.charAt(0)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-sm">
                    <span className={cn("truncate", !read[message.id] && "font-semibold")}>
                      {message.name}
                    </span>
                    {!read[message.id] ? (
                      <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                    ) : null}
                    <span className="ml-auto shrink-0 text-xs text-black/40">
                      {date.format(new Date(message.receivedAt))}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mt-1 inline-block rounded-md px-1.5 py-0.5 text-[0.7rem] font-medium",
                      typeStyles[message.type],
                    )}
                  >
                    {types[message.type]}
                  </span>
                  <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-black/50">
                    {message.message}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Reader */}
      <div className={cn("min-h-[24rem] flex-col", current ? "flex" : "hidden lg:flex")}>
        {current ? (
          <article className="flex flex-1 flex-col overflow-y-auto p-5 sm:p-8">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mb-4 inline-flex items-center gap-1.5 self-start text-sm text-black/55 lg:hidden"
            >
              <ArrowLeft aria-hidden className="size-4" />
              {copy.all}
            </button>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-full bg-brand-tint text-lg font-semibold text-brand-strong">
                  {current.name.charAt(0)}
                </span>
                <div>
                  <h2 className="font-heading text-lg font-semibold">{current.name}</h2>
                  <p className="text-sm text-black/50">{current.email}</p>
                </div>
              </div>
              <span
                className={cn("rounded-lg px-2 py-1 text-xs font-medium", typeStyles[current.type])}
              >
                {types[current.type]}
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-black/50">
              {current.organization ? (
                <p className="flex items-center gap-1.5">
                  <Building2 aria-hidden className="size-3.5" />
                  {current.organization}
                </p>
              ) : null}
              <p>{fill(copy.received, { date: full.format(new Date(current.receivedAt)) })}</p>
            </div>
            <p className="mt-6 max-w-2xl rounded-2xl bg-mist p-5 leading-relaxed whitespace-pre-line text-black/75">
              {current.message}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={`mailto:${current.email}?subject=${encodeURIComponent(`Re: ${types[current.type]}`)}`}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-strong"
              >
                <Mail aria-hidden className="size-4" />
                {copy.reply}
              </a>
              <button
                type="button"
                onClick={() => setRead((state) => ({ ...state, [current.id]: !state[current.id] }))}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium ring-1 ring-black/10 hover:bg-mist"
              >
                <MailOpen aria-hidden className="size-4" />
                {read[current.id] ? copy.markUnread : copy.markRead}
              </button>
            </div>
          </article>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center text-sm text-black/45">
            <Mail aria-hidden className="size-8 text-black/20" />
            {copy.select}
          </div>
        )}
      </div>
    </div>
  );
}

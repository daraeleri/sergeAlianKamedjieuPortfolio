"use client";

import { Download, MailWarning, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteSubscriber } from "@/app/actions/newsletter";
import { Card, fill } from "@/components/dashboard/ui";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { SubscriberRow } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

type Copy = Dictionary["dashboard"]["subscribers"];
type Filter = SubscriberRow["status"] | "all";

const statusStyles: Record<SubscriberRow["status"], string> = {
  active: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  unsubscribed: "bg-black/5 text-black/50",
};

const languageNames: Record<string, string> = { en: "English", fr: "Français" };

/** Newsletter subscribers: counts by status, a filterable list, CSV export and removal. */
export function SubscribersTable({
  subscribers,
  copy,
  locale,
  emailEnabled,
}: {
  subscribers: SubscriberRow[];
  copy: Copy;
  locale: string;
  emailEnabled: boolean;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [pending, startTransition] = useTransition();
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  const counts = {
    active: subscribers.filter((s) => s.status === "active").length,
    pending: subscribers.filter((s) => s.status === "pending").length,
    unsubscribed: subscribers.filter((s) => s.status === "unsubscribed").length,
  };
  const rows = filter === "all" ? subscribers : subscribers.filter((s) => s.status === filter);

  const remove = (row: SubscriberRow) => {
    if (!window.confirm(fill(copy.removeConfirm, { email: row.email }))) return;
    startTransition(async () => {
      await deleteSubscriber(row.id);
      router.refresh();
    });
  };

  const exportCsv = () => {
    const lines = [
      ["email", "language", "status", "joined"],
      ...rows.map((row) => [row.email, row.locale, row.status, row.createdAt.slice(0, 10)]),
    ];
    const csv = lines.map((line) => line.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","));
    const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "subscribers.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const tiles: { key: SubscriberRow["status"]; label: string }[] = [
    { key: "active", label: copy.active },
    { key: "pending", label: copy.pending },
    { key: "unsubscribed", label: copy.unsubscribed },
  ];

  return (
    <div className="space-y-6">
      {!emailEnabled ? (
        <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-600/15">
          <MailWarning aria-hidden className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-semibold">{copy.emailOff}</p>
            <p className="mt-0.5">{copy.emailOffText}</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        {tiles.map((tile) => (
          <button
            key={tile.key}
            type="button"
            onClick={() => setFilter(filter === tile.key ? "all" : tile.key)}
            aria-pressed={filter === tile.key}
            className={cn(
              "rounded-2xl bg-white p-5 text-left ring-1 ring-black/5 transition-shadow hover:ring-brand/30",
              filter === tile.key && "ring-2 ring-brand",
            )}
          >
            <p className="text-sm text-black/55">{tile.label}</p>
            <p className="mt-1 font-heading text-3xl font-semibold tabular-nums">
              {counts[tile.key]}
            </p>
          </button>
        ))}
      </div>

      <Card
        title={filter === "all" ? copy.title : copy.statuses[filter]}
        action={
          rows.length ? (
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-black/60 ring-1 ring-black/10 hover:bg-brand-tint hover:text-brand-strong"
            >
              <Download aria-hidden className="size-3.5" />
              {copy.exportCsv}
            </button>
          ) : null
        }
      >
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-sm">
              <thead>
                <tr className="text-left text-xs text-black/45">
                  <th className="px-5 py-3 font-medium">{copy.email}</th>
                  <th className="px-3 py-3 font-medium">{copy.language}</th>
                  <th className="px-3 py-3 font-medium">{copy.status}</th>
                  <th className="px-3 py-3 font-medium">{copy.joined}</th>
                  <th className="px-5 py-3">
                    <span className="sr-only">{copy.remove}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-black/5">
                    <td className="px-5 py-3 font-medium break-all">{row.email}</td>
                    <td className="px-3 py-3 text-black/60">
                      {languageNames[row.locale] ?? row.locale}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          statusStyles[row.status],
                        )}
                      >
                        {copy.statuses[row.status]}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-black/60 tabular-nums">
                      {date.format(new Date(row.createdAt))}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => remove(row)}
                        disabled={pending}
                        aria-label={`${copy.remove}: ${row.email}`}
                        className="rounded-lg p-1.5 text-black/40 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                      >
                        <Trash2 aria-hidden className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid place-items-center px-5 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-tint text-brand">
              <Users aria-hidden className="size-6" />
            </span>
            <p className="mt-4 font-medium">{copy.empty}</p>
            <p className="mt-1 max-w-sm text-sm text-black/55">{copy.emptyText}</p>
          </div>
        )}
      </Card>
    </div>
  );
}

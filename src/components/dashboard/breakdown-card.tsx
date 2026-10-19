"use client";

import {
  ArrowRight,
  Globe,
  Briefcase,
  Camera,
  Compass,
  Cpu,
  FileText,
  Hash,
  Link2,
  Mail,
  MessageCircle,
  Monitor,
  Play,
  Search,
  Share2,
  Smartphone,
  Tablet,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/** Icons a row can use; rows name them because components can't cross to the client. */
const icons = {
  page: FileText,
  section: Hash,
  direct: ArrowRight,
  whatsapp: MessageCircle,
  facebook: Users,
  google: Search,
  youtube: Play,
  instagram: Camera,
  linkedin: Briefcase,
  other: Globe,
  copy: Link2,
  email: Mail,
  native: Share2,
  browser: Compass,
  os: Cpu,
  mobile: Smartphone,
  desktop: Monitor,
  tablet: Tablet,
} satisfies Record<string, LucideIcon>;

export type BreakdownIcon = keyof typeof icons;

export type BreakdownRow = {
  label: string;
  sub?: string;
  value: number;
  icon?: BreakdownIcon;
  badge?: string;
};

export type BreakdownTab = { key: string; label: string; rows: BreakdownRow[] };

/** Card with tabs of ranked rows; each row is filled in proportion to the leader. */
export function BreakdownCard({
  title,
  tabs,
  locale,
  valueLabel,
  showPercent,
}: {
  title: string;
  tabs: BreakdownTab[];
  locale: string;
  valueLabel: string;
  showPercent?: boolean;
}) {
  const [key, setKey] = useState(tabs[0]?.key);
  const number = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const tab = tabs.find((item) => item.key === key) ?? tabs[0];
  const max = Math.max(1, ...tab.rows.map((row) => row.value));
  const total = tab.rows.reduce((sum, row) => sum + row.value, 0);

  return (
    <section className="flex flex-col rounded-2xl bg-white ring-1 ring-black/5">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 pt-5">
        <h2 className="text-sm font-semibold">{title}</h2>
        {tabs.length > 1 ? (
          <div role="tablist" aria-label={title} className="flex gap-3">
            {tabs.map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={item.key === tab.key}
                onClick={() => setKey(item.key)}
                className={cn(
                  "relative py-1 text-xs font-medium transition-colors",
                  item.key === tab.key ? "text-black" : "text-black/40 hover:text-black/70",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 -bottom-px h-0.5 origin-left rounded-full bg-brand transition-transform duration-300",
                    item.key === tab.key ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between px-5 text-[11px] font-medium tracking-wide text-black/40 uppercase">
        <span>{tab.label}</span>
        <span>{valueLabel}</span>
      </div>

      <ul role="tabpanel" key={tab.key} className="space-y-1 p-3 pt-1.5">
        {tab.rows.map((row, index) => {
          const Icon = row.icon ? icons[row.icon] : null;
          return (
            <li
              key={row.label}
              className="group relative flex animate-fade-up items-center gap-3 overflow-hidden rounded-lg px-2.5 py-2 text-sm"
              style={{ animationDelay: `${index * 35}ms`, animationDuration: "0.5s" }}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-0 left-0 rounded-lg transition-colors",
                  index === 0 ? "bg-brand/[0.13]" : "bg-brand-tint group-hover:bg-brand/10",
                )}
                style={{ width: `${(row.value / max) * 100}%` }}
              />
              {Icon ? (
                <Icon aria-hidden className="relative size-4 shrink-0 text-black/45" />
              ) : null}
              {row.badge ? (
                <span className="relative w-7 shrink-0 rounded-md bg-white/80 py-0.5 text-center text-[10px] font-semibold text-black/55 ring-1 ring-black/5">
                  {row.badge}
                </span>
              ) : null}
              <span className="relative min-w-0 flex-1">
                <span className="block truncate font-medium">{row.label}</span>
                {row.sub ? (
                  <span className="block truncate text-xs text-black/45">{row.sub}</span>
                ) : null}
              </span>
              <span className="relative tabular-nums">{number.format(row.value)}</span>
              {showPercent ? (
                <span className="relative w-9 text-right text-xs text-black/40 tabular-nums">
                  {Math.round((row.value / total) * 100)}%
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNav } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type DashboardNavProps = {
  locale: Locale;
  labels: Dictionary["dashboard"]["nav"];
};

export function DashboardNav({ locale, labels }: DashboardNavProps) {
  const pathname = usePathname();
  const overviewHref = localizePath(locale, "/dashboard");

  return (
    <nav aria-label={labels.label}>
      <ul className="flex gap-1 md:flex-col">
        {dashboardNav.map((item) => {
          const href = localizePath(locale, item.href);
          const active = href === overviewHref ? pathname === href : pathname.startsWith(href);
          return (
            <li key={item.key}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground",
                  active && "bg-surface font-medium text-foreground",
                )}
              >
                {labels[item.key]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, localeLabels, locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  locale: Locale;
  label: string;
  /** "label" shows "English / Français", "code" shows a compact "EN | FR" pill. */
  display?: "label" | "code";
  className?: string;
};

/** Links to the current page in each locale and remembers the visitor's choice. */
export function LanguageSwitcher({
  locale,
  label,
  display = "label",
  className,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  // Drop the leading "/<locale>" segment and keep the rest of the path.
  const rest = pathname.split("/").slice(2).join("/");
  const compact = display === "code";

  return (
    <nav
      aria-label={label}
      className={cn(
        compact ? "flex rounded-full bg-black/5 p-1 text-xs font-medium" : "flex gap-3 text-sm",
        className,
      )}
    >
      {locales.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={`/${l}${rest ? `/${rest}` : ""}` as Route}
            hrefLang={l}
            lang={l}
            aria-current={active ? "true" : undefined}
            title={compact ? localeLabels[l] : undefined}
            onClick={() => {
              document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
            }}
            className={cn(
              compact
                ? "rounded-full px-2.5 py-1 uppercase transition-colors"
                : "text-muted hover:text-foreground",
              compact && (active ? "bg-ink text-white" : "text-black/60 hover:text-black"),
              !compact && active && "font-medium text-foreground",
            )}
          >
            {compact ? l : localeLabels[l]}
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, localeLabels, locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  locale: Locale;
  label: string;
  className?: string;
};

/** Links to the current page in each locale and remembers the visitor's choice. */
export function LanguageSwitcher({ locale, label, className }: LanguageSwitcherProps) {
  const pathname = usePathname();
  // Drop the leading "/<locale>" segment and keep the rest of the path.
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <nav aria-label={label} className={cn("flex gap-3 text-sm", className)}>
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest ? `/${rest}` : ""}` as Route}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? "true" : undefined}
          onClick={() => {
            document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
          }}
          className={cn(
            "text-muted hover:text-foreground",
            l === locale && "font-medium text-foreground",
          )}
        >
          {localeLabels[l]}
        </Link>
      ))}
    </nav>
  );
}

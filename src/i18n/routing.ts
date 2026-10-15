import type { Metadata, Route } from "next";
import { siteConfig } from "@/config/site";
import { locales, ogLocales, type Locale } from "./config";

/** A path without the locale prefix, e.g. "/" or "/about". */
export type Pathname = "/" | `/${string}`;

/** Prefix a path with the locale: localizePath("fr", "/about") -> "/fr/about". */
export function localizePath(locale: Locale, pathname: Pathname): Route {
  return (pathname === "/" ? `/${locale}` : `/${locale}${pathname}`) as Route;
}

type PageMetadataOptions = {
  locale: Locale;
  pathname: Pathname;
  title?: string;
  description: string;
};

/**
 * Per-page metadata with the canonical URL, hreflang alternates and Open Graph tags.
 * Call it from every page's `generateMetadata`: these values must not live in a layout,
 * or each child page would inherit the layout's canonical URL. Next.js merges
 * metadata shallowly, so the full `openGraph` object is built here.
 */
export function pageMetadata({
  locale,
  pathname,
  title,
  description,
}: PageMetadataOptions): Metadata {
  const url = localizePath(locale, pathname);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(locales.map((l) => [l, localizePath(l, pathname)])),
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: title ?? siteConfig.name,
      description,
      url,
      locale: ogLocales[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
    },
  };
}

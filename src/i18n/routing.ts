import type { Metadata, Route } from "next";
import { siteConfig } from "@/config/site";
import { locales, ogLocales, type Locale } from "./config";

/** A path without the locale prefix, e.g. "/" or "/about". */
export type Pathname = "/" | `/${string}`;

/** Link to a section of the one-page home page: sectionHref("fr", "contact") -> "/fr#contact". */
export function sectionHref(locale: Locale, id: string): Route {
  return `/${locale}#${id}` as Route;
}

/** Prefix a path with the locale: localizePath("fr", "/about") -> "/fr/about". */
export function localizePath(locale: Locale, pathname: Pathname): Route {
  return (pathname === "/" ? `/${locale}` : `/${locale}${pathname}`) as Route;
}

type PageMetadataOptions = {
  locale: Locale;
  pathname: Pathname;
  title?: string;
  description: string;
  /** Set on article pages: shared links then show as articles, with their date. */
  article?: { publishedTime: string; section: string };
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
  article,
}: PageMetadataOptions): Metadata {
  const url = localizePath(locale, pathname);
  const shared = {
    siteName: siteConfig.name,
    title: title ?? siteConfig.name,
    description,
    url,
    locale: ogLocales[locale],
    alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
  };

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, localizePath(l, pathname)])),
        // Unprefixed paths redirect to the visitor's language (see proxy.ts).
        "x-default": pathname,
      },
    },
    openGraph: article
      ? {
          // The share image comes from the `opengraph-image` file next to the article page.
          ...shared,
          type: "article",
          publishedTime: article.publishedTime,
          section: article.section,
          authors: [siteConfig.name],
        }
      : {
          ...shared,
          type: "website",
          // The site's default share image (app/[lang]/opengraph-image.tsx). Named here
          // because this `openGraph` object replaces the one that file adds to the layout.
          images: [
            {
              url: localizePath(locale, "/opengraph-image"),
              width: 1200,
              height: 630,
              alt: siteConfig.name,
            },
          ],
        },
  };
}

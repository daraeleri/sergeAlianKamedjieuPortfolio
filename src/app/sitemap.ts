import type { MetadataRoute } from "next";
import { siteConfig, siteNav } from "@/config/site";
import { locales } from "@/i18n/config";
import { localizePath } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const absolute = (path: string) => new URL(path, siteConfig.url).toString();

  // Anchor items point into the home page, so only list distinct pages.
  const pages = [...new Set(siteNav.map((item) => item.href))];

  return pages.flatMap((href) =>
    locales.map((locale) => ({
      url: absolute(localizePath(locale, href)),
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, absolute(localizePath(l, href))])),
      },
    })),
  );
}

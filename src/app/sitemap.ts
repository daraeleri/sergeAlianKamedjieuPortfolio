import type { MetadataRoute } from "next";
import { siteConfig, siteNav } from "@/config/site";
import { locales } from "@/i18n/config";
import { localizePath } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const absolute = (path: string) => new URL(path, siteConfig.url).toString();

  return siteNav.flatMap((item) =>
    locales.map((locale) => ({
      url: absolute(localizePath(locale, item.href)),
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, absolute(localizePath(l, item.href))]),
        ),
      },
    })),
  );
}

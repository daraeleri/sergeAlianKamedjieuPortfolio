import type { MetadataRoute } from "next";
import { siteConfig, siteNav } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return siteNav.map((item) => ({
    url: new URL(item.href, siteConfig.url).toString(),
  }));
}

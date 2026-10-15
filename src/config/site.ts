import type { Dictionary } from "@/i18n/get-dictionary";
import type { Pathname } from "@/i18n/routing";
import { env } from "@/lib/env";

/** Locale-independent site settings. Translated copy lives in src/i18n/dictionaries. */
export const siteConfig = {
  name: "Serge Alain Kamedjieu",
  url: env.NEXT_PUBLIC_SITE_URL,
} as const;

type NavItem<K> = { key: K; href: Pathname };

export const siteNav: NavItem<keyof Dictionary["nav"]>[] = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "teaching", href: "/teaching" },
  { key: "contact", href: "/contact" },
];

export const dashboardNav: NavItem<keyof Dictionary["dashboard"]["nav"]>[] = [
  { key: "overview", href: "/dashboard" },
  { key: "teaching", href: "/dashboard/teaching" },
  { key: "messages", href: "/dashboard/messages" },
  { key: "settings", href: "/dashboard/settings" },
];

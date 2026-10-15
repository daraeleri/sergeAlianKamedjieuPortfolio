import type { Route } from "next";
import { env } from "@/lib/env";

export const siteConfig = {
  name: "Serge Alain Kamedjieu",
  title: "Pastor Serge Alain Kamedjieu",
  description: "Pastor, teacher and servant of the Word. Sermons, events and ministry updates.",
  url: env.NEXT_PUBLIC_SITE_URL,
  locale: "en",
} as const;

type NavItem = { label: string; href: Route };

export const siteNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Sermons", href: "/sermons" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

export const dashboardNav: NavItem[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "Sermons", href: "/dashboard/sermons" },
  { label: "Events", href: "/dashboard/events" },
  { label: "Messages", href: "/dashboard/messages" },
  { label: "Settings", href: "/dashboard/settings" },
];

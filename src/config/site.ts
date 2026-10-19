import type { Dictionary } from "@/i18n/get-dictionary";
import type { Pathname } from "@/i18n/routing";
import { env } from "@/lib/env";

/** Locale-independent site settings. Translated copy lives in src/i18n/dictionaries. */
export const siteConfig = {
  name: "Serge Alain Kamedjieu",
  url: env.NEXT_PUBLIC_SITE_URL,
  /**
   * Official JAFAN Ministries website, used by the Ministries call-to-action.
   * PLACEHOLDER: replace with the real address (".example" never resolves).
   */
  jafanUrl: "https://jafan-ministries.example",
  /**
   * Public contact email shown in the Contact section, as written in his biography.
   * CONFIRM the spelling ("minitries") before launch.
   */
  contactEmail: "jafanminitries@gmail.com",
  /** City shown in the Contact section. */
  location: "Bafoussam, Cameroon",
} as const;

type NavItem<K> = {
  key: K;
  href: Pathname;
  /** Section id on that page, for one-page anchors such as "about". */
  hash?: string;
};

/** One-page site: most items scroll to a section of the home page. */
export const siteNav: NavItem<keyof Dictionary["nav"]>[] = [
  { key: "home", href: "/" },
  { key: "about", href: "/", hash: "about" },
  { key: "academics", href: "/", hash: "academics" },
  { key: "ministries", href: "/", hash: "ministries" },
  { key: "books", href: "/", hash: "books" },
  { key: "articles", href: "/", hash: "articles" },
  { key: "contact", href: "/", hash: "contact" },
];

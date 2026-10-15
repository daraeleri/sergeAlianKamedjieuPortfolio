/**
 * Locale settings shared by the server, the proxy and Client Components.
 * Keep this file free of server-only imports.
 */
export const locales = ["en", "fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Cookie that remembers a visitor's explicit language choice. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

/** Open Graph locale codes. */
export const ogLocales: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
};

export function hasLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

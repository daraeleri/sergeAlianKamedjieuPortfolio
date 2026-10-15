import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import type en from "./dictionaries/en.json";
import { hasLocale, type Locale } from "./config";

export type Dictionary = typeof en;

// Each locale must match the English shape, so a missing key is a type error.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
};

/** Current locale from the `[lang]` root segment. Server Components only. */
export async function getLocale(): Promise<Locale> {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return locale;
}

/** Dictionary for the current locale. Server Components only. */
export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()]();
}

import type { Metadata } from "next";
import { Unsubscribe } from "@/components/site/newsletter-status";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.newsletter.unsubscribe.metaTitle, robots: { index: false, follow: false } };
}

/** Opened from the newsletter emails; the token follows "#" in the link. */
export default async function UnsubscribePage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return (
    <div className="grid min-h-[80svh] place-items-center bg-mist px-4 pt-32 pb-20 text-ink">
      <Unsubscribe
        copy={dict.newsletter}
        links={{ home: localizePath(locale, "/"), articles: localizePath(locale, "/articles") }}
      />
    </div>
  );
}

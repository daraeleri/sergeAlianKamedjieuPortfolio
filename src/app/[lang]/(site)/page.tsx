import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return {
    ...pageMetadata({
      locale,
      pathname: "/",
      title: dict.site.title,
      description: dict.site.description,
    }),
    // The home page uses the full site title, without the "%s | Name" template.
    title: { absolute: dict.site.title },
  };
}

export default async function HomePage() {
  const dict = await getDictionary();

  return (
    <section className="space-y-4">
      <h1 className="text-4xl font-semibold tracking-tight">{dict.site.title}</h1>
      <p className="max-w-2xl text-lg text-muted">{dict.site.description}</p>
    </section>
  );
}

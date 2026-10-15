import type { Metadata } from "next";
import { AboutSection } from "@/components/site/about-section";
import { Hero } from "@/components/site/hero";
import { TeachingSection } from "@/components/teaching/teaching-section";
import { disciplines } from "@/content/teaching";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath, pageMetadata } from "@/i18n/routing";

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
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <>
      <Hero locale={locale} copy={dict.hero} />
      <AboutSection locale={locale} copy={dict.about} />
      <TeachingSection
        copy={dict.teaching}
        contactHref={localizePath(locale, "/contact")}
        disciplines={disciplines.map((d) => ({
          slug: d.slug,
          icon: d.icon,
          title: d.title[locale],
          description: d.description[locale],
          topics: d.topics[locale],
        }))}
      />
    </>
  );
}

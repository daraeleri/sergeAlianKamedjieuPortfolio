import type { Metadata } from "next";
import { AboutSection } from "@/components/site/about-section";
import { AcademicsSection } from "@/components/site/academics-section";
import { Hero } from "@/components/site/hero";
import { MinistriesSection } from "@/components/site/ministries-section";
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
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <>
      <Hero locale={locale} copy={dict.hero} />
      <AboutSection locale={locale} copy={dict.about} />
      <AcademicsSection copy={dict.academics} />
      <MinistriesSection copy={dict.ministries} />
    </>
  );
}

import type { Metadata } from "next";
import { AboutSection } from "@/components/site/about-section";
import { AcademicsSection } from "@/components/site/academics-section";
import { ArticlesSection } from "@/components/site/articles-section";
import { BooksSection } from "@/components/site/books-section";
import { ContactSection } from "@/components/site/contact-section";
import { Hero } from "@/components/site/hero";
import { MinistriesSection } from "@/components/site/ministries-section";
import { ReachSection } from "@/components/site/reach-section";
import { siteConfig } from "@/config/site";
import { articleMeta } from "@/content/articles";
import { bookCovers } from "@/content/books";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { pageMetadata, sectionHref } from "@/i18n/routing";

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
  const dateFormat = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <>
      <Hero locale={locale} copy={dict.hero} />
      <AboutSection locale={locale} copy={dict.about} />
      <AcademicsSection copy={dict.academics} />
      <MinistriesSection copy={dict.ministries} websiteUrl={siteConfig.jafanUrl} />
      <BooksSection
        copy={dict.books}
        orderHref={sectionHref(locale, "contact")}
        author={siteConfig.name}
        books={dict.books.items.map((book) => ({ ...book, cover: bookCovers[book.slug] }))}
      />
      <ArticlesSection
        copy={dict.articles}
        avatar="/images/PersonaImage.png"
        articles={dict.articles.items.flatMap((article) => {
          const meta = articleMeta[article.slug];
          if (!meta) return [];
          return [{ ...article, ...meta, dateLabel: dateFormat.format(new Date(meta.date)) }];
        })}
      />
      <ReachSection copy={dict.reach} />
      <ContactSection
        copy={dict.contact}
        email={siteConfig.contactEmail}
        location={siteConfig.location}
      />
    </>
  );
}

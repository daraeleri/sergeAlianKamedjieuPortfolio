import type { Metadata } from "next";
import { BooksSection } from "@/components/books/books-section";
import { AboutSection } from "@/components/site/about-section";
import { Hero } from "@/components/site/hero";
import { siteConfig } from "@/config/site";
import { books } from "@/content/books";
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
  const booksHref = localizePath(locale, "/books");

  return (
    <>
      <Hero locale={locale} copy={dict.hero} />
      <AboutSection locale={locale} copy={dict.about} />
      <BooksSection
        copy={dict.books}
        author={siteConfig.name}
        allBooksHref={booksHref}
        books={books.map((book) => ({
          slug: book.slug,
          year: book.year,
          publisher: book.publisher,
          theme: book.theme,
          cover: book.cover,
          title: book.title[locale],
          subtitle: book.subtitle[locale],
          summary: book.summary[locale],
          tags: book.tags[locale],
          // Until each book has its own page, every link goes to the Books page.
          href: booksHref,
        }))}
      />
    </>
  );
}

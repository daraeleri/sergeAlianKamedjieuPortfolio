import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return pageMetadata({ locale, pathname: "/books", ...dict.pages.books });
}

export default async function BooksPage() {
  const { title, description } = (await getDictionary()).pages.books;
  return <PageHeader site title={title} description={description} />;
}

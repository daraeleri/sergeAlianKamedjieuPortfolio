import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return pageMetadata({ locale, pathname: "/about", ...dict.pages.about });
}

export default async function AboutPage() {
  const { title, description } = (await getDictionary()).pages.about;
  return <PageHeader title={title} description={description} />;
}

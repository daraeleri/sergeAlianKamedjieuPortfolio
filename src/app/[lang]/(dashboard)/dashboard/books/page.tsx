import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = (await getDictionary()).dashboard.books;
  return { title, description };
}

export default async function DashboardBooksPage() {
  const { title, description } = (await getDictionary()).dashboard.books;
  return <PageHeader title={title} description={description} />;
}

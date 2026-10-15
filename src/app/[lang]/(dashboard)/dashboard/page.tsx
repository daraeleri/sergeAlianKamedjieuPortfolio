import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = (await getDictionary()).dashboard.overview;
  return { title, description };
}

export default async function DashboardPage() {
  const { title, description } = (await getDictionary()).dashboard.overview;
  return <PageHeader title={title} description={description} />;
}

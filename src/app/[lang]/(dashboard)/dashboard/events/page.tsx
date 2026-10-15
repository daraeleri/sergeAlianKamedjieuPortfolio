import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = (await getDictionary()).dashboard.events;
  return { title, description };
}

export default async function DashboardEventsPage() {
  const { title, description } = (await getDictionary()).dashboard.events;
  return <PageHeader title={title} description={description} />;
}

import type { Metadata } from "next";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-shell";
import { SubscribersTable } from "@/components/dashboard/subscribers-table";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { getSubscribers } from "@/lib/dashboard/data";
import { emailEnabled } from "@/lib/email/send";

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = (await getDictionary()).dashboard.subscribers;
  return { title, description };
}

export default async function DashboardSubscribersPage() {
  const [locale, dict, subscribers] = await Promise.all([
    getLocale(),
    getDictionary(),
    getSubscribers(),
  ]);
  const copy = dict.dashboard.subscribers;
  return (
    <>
      <DashboardPageHeader title={copy.title} description={copy.description} />
      <SubscribersTable
        subscribers={subscribers}
        copy={copy}
        locale={locale}
        emailEnabled={emailEnabled()}
      />
    </>
  );
}

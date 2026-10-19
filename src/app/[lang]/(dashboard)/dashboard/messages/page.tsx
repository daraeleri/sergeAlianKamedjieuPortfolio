import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-shell";
import { Inbox } from "@/components/dashboard/inbox";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { getMessages } from "@/lib/dashboard/data";

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = (await getDictionary()).dashboard.messages;
  return { title, description };
}

export default async function DashboardMessagesPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const copy = dict.dashboard.messages;
  return (
    <>
      <DashboardPageHeader title={copy.title} description={copy.description} />
      {/* The inbox reads ?id= to open a message, so it renders on the client. */}
      <Suspense>
        <Inbox
          messages={getMessages()}
          copy={copy}
          types={dict.contact.form.types}
          locale={locale}
        />
      </Suspense>
    </>
  );
}

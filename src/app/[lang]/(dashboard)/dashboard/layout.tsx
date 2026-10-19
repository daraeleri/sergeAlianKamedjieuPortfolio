import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { siteConfig } from "@/config/site";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { getDashboardArticles, getMessages } from "@/lib/dashboard/data";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: { default: dict.dashboard.title, template: `%s | ${dict.dashboard.title}` },
    robots: { index: false, follow: false },
  };
}

export default async function DashboardLayout({ children }: LayoutProps<"/[lang]/dashboard">) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const openDrafts = getDashboardArticles().filter((article) => article.status !== "published");
  const unread = getMessages().filter((message) => !message.read);

  return (
    <DashboardShell
      locale={locale}
      copy={dict.dashboard}
      languageLabel={dict.nav.language}
      user={{ name: siteConfig.name, avatar: "/images/PersonaImage.png" }}
      badges={{ articles: openDrafts.length, messages: unread.length }}
    >
      {children}
    </DashboardShell>
  );
}

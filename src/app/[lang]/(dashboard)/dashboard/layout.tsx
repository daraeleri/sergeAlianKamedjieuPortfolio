import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

// Private, live data: dashboard pages render on the server for each request, after
// checking the session, instead of serving a prerendered shell.
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: { default: dict.dashboard.title, template: `%s | ${dict.dashboard.title}` },
    robots: { index: false, follow: false },
  };
}

export default async function DashboardLayout({ children }: LayoutProps<"/[lang]/dashboard">) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const user = await requireUser(locale);
  const [openDrafts, unread] = await Promise.all([
    db.article.count({ where: { status: { not: "published" } } }),
    db.message.count({ where: { read: false } }),
  ]);

  return (
    <DashboardShell
      locale={locale}
      copy={dict.dashboard}
      signOutLabel={dict.auth.signOut}
      languageLabel={dict.nav.language}
      user={{ name: user.name, avatar: "/images/PersonaImage.png" }}
      badges={{ articles: openDrafts, messages: unread }}
    >
      {children}
    </DashboardShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: { default: dict.dashboard.title, template: `%s | ${dict.dashboard.title}` },
    robots: { index: false, follow: false },
  };
}

export default async function DashboardLayout({ children }: LayoutProps<"/[lang]/dashboard">) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <div className="flex min-h-full flex-1 flex-col md:flex-row">
      <aside className="flex flex-col gap-4 border-b border-border p-4 md:w-60 md:shrink-0 md:border-r md:border-b-0">
        <Link href={localizePath(locale, "/")} className="block px-3 text-sm font-semibold">
          {dict.dashboard.viewSite}
        </Link>
        <DashboardNav locale={locale} labels={dict.dashboard.nav} />
        <LanguageSwitcher locale={locale} label={dict.nav.language} className="px-3 md:mt-auto" />
      </aside>
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}

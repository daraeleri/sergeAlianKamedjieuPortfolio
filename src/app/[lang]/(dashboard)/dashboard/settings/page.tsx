import type { Metadata } from "next";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-shell";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = (await getDictionary()).dashboard.settings;
  return { title, description };
}

export default async function DashboardSettingsPage() {
  const dict = await getDictionary();
  const copy = dict.dashboard.settings;
  return (
    <>
      <DashboardPageHeader title={copy.title} description={copy.description} />
      <SettingsForm
        copy={copy}
        avatar="/images/PersonaImage.png"
        initial={{
          name: siteConfig.name,
          role: dict.articles.detail.authorRole,
          email: siteConfig.contactEmail,
          location: siteConfig.location,
          jafanUrl: siteConfig.jafanUrl,
        }}
      />
    </>
  );
}

import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Settings",
};

export default function DashboardSettingsPage() {
  return <PageHeader title="Settings" description="Profile, site details and account settings." />;
}

import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Overview",
};

export default function DashboardPage() {
  return (
    <PageHeader title="Overview" description="Welcome back. Manage your site content from here." />
  );
}

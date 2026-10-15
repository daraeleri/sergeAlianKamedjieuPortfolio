import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Messages",
};

export default function DashboardMessagesPage() {
  return (
    <PageHeader title="Messages" description="Contact form submissions and prayer requests." />
  );
}

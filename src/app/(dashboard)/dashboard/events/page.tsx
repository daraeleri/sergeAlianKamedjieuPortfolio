import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Events",
};

export default function DashboardEventsPage() {
  return <PageHeader title="Events" description="Schedule and manage upcoming events." />;
}

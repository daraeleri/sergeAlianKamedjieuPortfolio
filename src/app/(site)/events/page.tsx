import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Events",
};

export default function EventsPage() {
  return <PageHeader title="Events" description="Upcoming services, conferences and gatherings." />;
}

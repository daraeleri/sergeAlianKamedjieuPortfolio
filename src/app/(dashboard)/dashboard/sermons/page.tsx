import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Sermons",
};

export default function DashboardSermonsPage() {
  return <PageHeader title="Sermons" description="Create, edit and publish sermons." />;
}

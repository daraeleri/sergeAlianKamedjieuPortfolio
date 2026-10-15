import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Sermons",
};

export default function SermonsPage() {
  return <PageHeader title="Sermons" description="Recent messages and teaching series." />;
}

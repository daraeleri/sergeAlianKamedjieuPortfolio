import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return <PageHeader title="About" description="Biography, calling and ministry journey." />;
}

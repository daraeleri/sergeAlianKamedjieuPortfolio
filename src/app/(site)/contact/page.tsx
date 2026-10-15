import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <PageHeader
      title="Contact"
      description="Prayer requests, speaking invitations and enquiries."
    />
  );
}

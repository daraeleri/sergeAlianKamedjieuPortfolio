import { Suspense } from "react";
import { PageTracker } from "@/components/site/page-tracker";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <Suspense>
        <PageTracker />
      </Suspense>
      <SiteHeader />
      {/* Pages own their width and top spacing: the navbar is fixed and overlays them. */}
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}

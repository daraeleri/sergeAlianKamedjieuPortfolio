import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-border border-t">
      <div className="text-muted mx-auto max-w-6xl px-6 py-8 text-sm">{siteConfig.name}</div>
    </footer>
  );
}

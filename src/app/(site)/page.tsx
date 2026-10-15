import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-4xl font-semibold tracking-tight">{siteConfig.title}</h1>
      <p className="text-muted max-w-2xl text-lg">{siteConfig.description}</p>
    </section>
  );
}

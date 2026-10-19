import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { articleShareImage } from "@/lib/article-share-image";
import { ogSize } from "@/lib/og";

/** The article's link preview on Facebook, WhatsApp, LinkedIn and others. */
export const alt = siteConfig.name;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  return (await articleShareImage(lang, slug)) ?? notFound();
}

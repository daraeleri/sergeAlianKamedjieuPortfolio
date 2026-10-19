import { articleShareImage } from "@/lib/article-share-image";

/**
 * An article's share image at a stable address, for the dashboard's share panel
 * (preview, download, and the phone's share sheet for WhatsApp or Facebook stories).
 * Pages use the `opengraph-image` file instead, whose address Next.js generates.
 */
export async function GET(_request: Request, { params }: RouteContext<"/api/share-image/[lang]/[slug]">) {
  const { lang, slug } = await params;
  const image = await articleShareImage(lang, slug);
  if (!image) return new Response("Not found", { status: 404 });
  image.headers.set("Cache-Control", "public, max-age=300");
  return image;
}

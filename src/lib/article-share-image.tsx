import "server-only";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { hasLocale } from "@/i18n/config";
import { loadDictionary } from "@/i18n/get-dictionary";
import { getArticles } from "@/lib/content";
import { OgCurve, OgMonogram, ogColors, ogPortrait, ogSize } from "@/lib/og";

/*
 * Share image of an article: category, title, author and date on the brand blue.
 * Generated rather than taken from the cover, because covers can be stored inline
 * (data URIs), which Facebook and WhatsApp can't fetch, and their size isn't known.
 */

/** Smaller type for longer titles, so every title fits in four lines. */
function titleSize(title: string) {
  if (title.length <= 40) return 76;
  if (title.length <= 70) return 64;
  if (title.length <= 110) return 52;
  return 44;
}

/**
 * Share image of one published article, or null when the language or article doesn't
 * exist. Used for the article's link previews and by the dashboard's share panel.
 */
export async function articleShareImage(lang: string, slug: string) {
  if (!hasLocale(lang)) return null;
  const [articles, dict, portrait] = await Promise.all([
    getArticles(lang),
    loadDictionary(lang),
    ogPortrait(),
  ]);
  const article = articles.find((item) => item.slug === slug);
  if (!article) return null;
  const title = article.title.length > 160 ? `${article.title.slice(0, 157)}…` : article.title;

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "60px 72px",
        background: ogColors.brand,
        color: "white",
      }}
    >
      <OgCurve color="white" opacity={0.12} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            padding: "10px 22px",
            borderRadius: 999,
            background: "white",
            color: ogColors.brand,
            fontSize: 24,
          }}
        >
          {article.category}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24 }}>
          {dict.nav.articles}
          <OgMonogram size={48} onBrand />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          maxWidth: 1000,
          fontSize: titleSize(title),
          lineHeight: 1.08,
          letterSpacing: -1.5,
        }}
      >
        {title}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            width: 84,
            height: 84,
            borderRadius: 84,
            overflow: "hidden",
            background: ogColors.tint,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
          <img src={portrait} alt="" width={150} height={200} style={{ marginTop: -6 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 28 }}>{siteConfig.name}</div>
          <div style={{ fontSize: 22, color: "rgba(255,255,255,0.75)" }}>{article.dateLabel}</div>
        </div>
      </div>
    </div>,
    ogSize,
  );
}

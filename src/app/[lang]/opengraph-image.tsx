import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { hasLocale } from "@/i18n/config";
import { loadDictionary } from "@/i18n/get-dictionary";
import { OgCurve, OgMonogram, ogColors, ogPortrait, ogSize } from "@/lib/og";

/**
 * Default share image for the site (home page and any page without its own): the hero
 * title and the author's portrait. Article pages generate their own.
 */
export const alt = siteConfig.name;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, portrait] = await Promise.all([loadDictionary(lang), ogPortrait()]);
  const hero = dict.hero;

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        background: ogColors.ink,
        color: "white",
      }}
    >
      <OgCurve color={ogColors.brand} opacity={0.35} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 780,
          padding: "64px 0 64px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <OgMonogram />
          <div style={{ fontSize: 30 }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.6)", letterSpacing: 0.5 }}>
            {hero.eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 18,
              fontSize: 70,
              lineHeight: 1.06,
              letterSpacing: -2,
            }}
          >
            <div>{hero.titleLead}</div>
            <div style={{ color: ogColors.brandSoft }}>{hero.titleHighlight}</div>
          </div>
        </div>

        <div style={{ fontSize: 24, color: "rgba(255,255,255,0.6)" }}>{hero.proof}</div>
      </div>

      {/* Portrait on a blue disc, cut off by the bottom edge. */}
      <div
        style={{
          position: "absolute",
          right: 50,
          bottom: -150,
          width: 360,
          height: 360,
          borderRadius: 360,
          background: ogColors.brand,
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
      <img
        src={portrait}
        alt=""
        width={360}
        height={480}
        style={{ position: "absolute", right: 50, bottom: 0 }}
      />
    </div>,
    size,
  );
}

import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Shared pieces of the generated share images (Open Graph): the previews Facebook,
 * WhatsApp, LinkedIn and others show when a link to the site is shared. Rendered with
 * `ImageResponse`, which supports a subset of CSS (flexbox only: every element with
 * more than one child needs `display: flex`).
 */

/** The size Facebook, WhatsApp and LinkedIn recommend for link previews. */
export const ogSize = { width: 1200, height: 630 };

export const ogColors = {
  brand: "#4169e1",
  brandSoft: "#7b9bff",
  ink: "#0a0a0a",
  tint: "#f3f6ff",
};

let portrait: Promise<string> | undefined;

/**
 * The author's cut-out portrait as a data URI. A small copy (assets/og-portrait.png,
 * 360×480) keeps the images light: WhatsApp skips previews of heavy images.
 */
export function ogPortrait() {
  portrait ??= readFile(join(process.cwd(), "assets/og-portrait.png")).then(
    (file) => `data:image/png;base64,${file.toString("base64")}`,
  );
  return portrait;
}

/** The "SK" monogram used in the navbar and the favicon. */
export function OgMonogram({ size = 56, onBrand = false }: { size?: number; onBrand?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: size * 0.28,
        // White on the brand-blue images, blue elsewhere.
        background: onBrand ? "white" : ogColors.brand,
        color: onBrand ? ogColors.brand : "white",
        fontSize: size * 0.42,
        letterSpacing: -0.5,
      }}
    >
      SK
    </div>
  );
}

/** Decorative stroke from the site's article covers, drawn in a corner. */
export function OgCurve({ color, opacity }: { color: string; opacity: number }) {
  return (
    <svg
      width="1200"
      height="630"
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, opacity }}
    >
      <path
        d="M-60 420 C 220 380 360 140 560 170 C 740 196 660 380 510 340 C 360 300 520 70 820 80 C 1020 88 1120 220 1280 140"
        fill="none"
        stroke={color}
        strokeWidth="60"
        strokeLinecap="round"
      />
    </svg>
  );
}

import { ImageResponse } from "next/og";
import { ART_HEIGHT, ART_WIDTH, envelopeDataUri } from "@/lib/newsletter-art";

/**
 * The newsletter illustration as a PNG for email headers (email apps don't show SVG).
 * Rendered at twice the display size so it stays sharp on high-density screens.
 */
export function GET() {
  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img>
    <img src={envelopeDataUri} width={ART_WIDTH * 2} height={ART_HEIGHT * 2} alt="" />,
    {
      width: ART_WIDTH * 2,
      height: ART_HEIGHT * 2,
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}

import { ImageResponse } from "next/og";
import { ogColors } from "@/lib/og";

/** Home-screen icon on iPhone and iPad. iOS rounds the corners itself. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: ogColors.brand,
        color: "white",
        fontSize: 82,
        letterSpacing: -2,
      }}
    >
      SK
    </div>,
    size,
  );
}

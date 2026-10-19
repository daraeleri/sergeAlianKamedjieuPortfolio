import type { Metadata, Viewport } from "next";
import { Caveat, Outfit, Rubik } from "next/font/google";
import { siteConfig } from "@/config/site";
import { locales } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import "../globals.css";

const body = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

// Stand-in for Nohemi until its licensed font files are added. To switch, load
// Nohemi with `next/font/local` under the same `--font-heading-face` variable.
const heading = Outfit({
  variable: "--font-heading-face",
  subsets: ["latin"],
});

// Handwritten notes in the hero.
const hand = Caveat({
  variable: "--font-hand-face",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Canonical, hreflang and Open Graph tags are set per page with `pageMetadata`.
export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: dict.site.title,
      template: `%s | ${siteConfig.name}`,
    },
    description: dict.site.description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    // Let Google show large image previews and full snippets (Discover, search results).
    robots: {
      googleBot: { "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  return (
    <html
      lang={await getLocale()}
      className={`${body.variable} ${heading.variable} ${hand.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}

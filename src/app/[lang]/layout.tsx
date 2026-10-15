import type { Metadata, Viewport } from "next";
import { Geist_Mono, Outfit, Rubik } from "next/font/google";
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

// Small uppercase section labels ("◆ About"), as in the Fluid Glass reference.
const mono = Geist_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  weight: "500",
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
      className={`${body.variable} ${heading.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}

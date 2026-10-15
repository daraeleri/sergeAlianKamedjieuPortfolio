import type { Metadata } from "next";
import Link from "next/link";
import { defaultLocale } from "@/i18n/config";
import "./globals.css";

// Rendered for URLs that match no route at all, so no [lang] layout wraps it.
export const metadata: Metadata = {
  title: "404 - Page not found",
};

export default function GlobalNotFound() {
  return (
    <html lang={defaultLocale} className="h-full antialiased">
      <body className="flex min-h-full flex-col items-center justify-center gap-4 px-6 text-center font-sans">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="text-muted">Page introuvable</p>
        <Link href={`/${defaultLocale}`} className="underline underline-offset-4">
          Home / Accueil
        </Link>
      </body>
    </html>
  );
}

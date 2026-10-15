"use client";

import { useParams } from "next/navigation";
import { defaultLocale, hasLocale, type Locale } from "@/i18n/config";

type ErrorCopy = { title: string; retry: string; reference: string; fallback: string };

// Error boundaries are Client Components, so they cannot load the server dictionaries.
const copy: Record<Locale, ErrorCopy> = {
  en: {
    title: "Something went wrong",
    retry: "Try again",
    reference: "Reference",
    fallback: "Please try again.",
  },
  fr: {
    title: "Une erreur est survenue",
    retry: "Réessayer",
    reference: "Référence",
    fallback: "Veuillez réessayer.",
  },
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { lang } = useParams<{ lang: string }>();
  const t = copy[hasLocale(lang) ? lang : defaultLocale];

  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold">{t.title}</h1>
      <p className="text-muted">{error.digest ? `${t.reference}: ${error.digest}` : t.fallback}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md border border-border px-4 py-2 hover:bg-surface"
      >
        {t.retry}
      </button>
    </main>
  );
}

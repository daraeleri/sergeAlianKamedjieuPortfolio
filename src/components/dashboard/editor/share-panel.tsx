"use client";

import { ArrowUpRight, Check, Copy, Download, Link2, Smartphone } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { fill } from "@/components/dashboard/ui";
import { siteConfig } from "@/config/site";
import { localeLabels, locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { articleHref } from "@/lib/articles";
import { cn } from "@/lib/utils";

type Copy = Dictionary["dashboard"]["editor"]["share"];
type Bilingual = Record<Locale, string>;

const noSubscribe = () => () => {};

const actionClass =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-mist px-3 py-2.5 text-sm font-medium transition-colors hover:bg-brand-tint hover:text-brand-strong";

/**
 * Editor side panel: shares a published article on Facebook, WhatsApp and other apps,
 * in either language. Shows the link preview (the generated share image), copies the
 * link or a ready-made message, opens the phone's share sheet with the image attached
 * (for a WhatsApp status or a Facebook story) and downloads the image.
 * No brand icons (Lucide only), so the apps are named in each button.
 */
export function SharePanel({
  id,
  published,
  title,
  excerpt,
  copy,
  locale,
}: {
  /** Database id (the article's slug), or null while the article has never been saved. */
  id: string | null;
  published: boolean;
  title: Bilingual;
  excerpt: Bilingual;
  copy: Copy;
  locale: Locale;
}) {
  const [lang, setLang] = useState<Locale>(locale);
  const [copied, setCopied] = useState<"link" | "message" | null>(null);
  // The share sheet only exists in some browsers (mostly phones); the server render assumes it does not.
  const canShare = useSyncExternalStore(
    noSubscribe,
    () => typeof navigator.share === "function",
    () => false,
  );

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(null), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (!id || !published) {
    return (
      <section className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
        <h2 className="text-sm font-medium">{copy.title}</h2>
        <p className="mt-1.5 text-sm text-black/55">{copy.publishFirst}</p>
      </section>
    );
  }

  // Fall back to the other language while a translation is missing, as the site does.
  const other = locales.find((l) => l !== lang)!;
  const articleTitle = title[lang] || title[other];
  const url = `${siteConfig.url}${articleHref(lang, id)}`;
  const message = fill(copy.message, {
    title: articleTitle,
    excerpt: excerpt[lang] || excerpt[other],
    url,
  });
  const imageUrl = `/api/share-image/${lang}/${id}`;
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(articleTitle);

  const apps = [
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(message)}` },
    { name: "X", href: `https://x.com/intent/post?text=${t}&url=${u}` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: "Telegram", href: `https://t.me/share/url?url=${u}&text=${t}` },
  ];

  const copyText = (value: string, kind: "link" | "message") => {
    navigator.clipboard?.writeText(value).then(
      () => setCopied(kind),
      () => {},
    );
  };

  // With the image attached when the phone allows it, so a status or story shows it.
  const shareFromPhone = async () => {
    try {
      const blob = await fetch(imageUrl).then((response) => response.blob());
      const file = new File([blob], `${id}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: articleTitle, text: message });
        return;
      }
    } catch (error) {
      // The visitor closed the share sheet: nothing else to do.
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
    await navigator.share({ title: articleTitle, text: message, url }).catch(() => {});
  };

  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium">{copy.title}</h2>
        <div
          role="radiogroup"
          aria-label={copy.language}
          className="flex rounded-lg bg-mist p-0.5 text-xs font-semibold"
        >
          {locales.map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={lang === value}
              title={localeLabels[value]}
              onClick={() => setLang(value)}
              className={cn(
                "rounded-md px-2 py-1 uppercase transition-colors",
                lang === value ? "bg-white text-ink shadow-sm" : "text-black/45 hover:text-ink",
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1.5 text-sm text-black/55">{copy.text}</p>

      <div className="relative mt-4 aspect-[1200/630] overflow-hidden rounded-xl bg-mist ring-1 ring-black/5">
        <Image
          key={imageUrl}
          src={imageUrl}
          alt={copy.previewAlt}
          fill
          unoptimized
          sizes="20rem"
          className="object-cover"
        />
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-2">
        {apps.map((app) => (
          <li key={app.name} className={app.name === "Telegram" ? "col-span-2" : undefined}>
            <a
              href={app.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={fill(copy.openIn, { app: app.name })}
              className={cn(actionClass, "w-full")}
            >
              {app.name}
              <ArrowUpRight aria-hidden className="size-3.5 opacity-50" />
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => copyText(url, "link")} className={actionClass}>
          {copied === "link" ? (
            <Check aria-hidden className="size-4 text-emerald-600" />
          ) : (
            <Link2 aria-hidden className="size-4" />
          )}
          {copied === "link" ? copy.copied : copy.copyLink}
        </button>
        <button type="button" onClick={() => copyText(message, "message")} className={actionClass}>
          {copied === "message" ? (
            <Check aria-hidden className="size-4 text-emerald-600" />
          ) : (
            <Copy aria-hidden className="size-4" />
          )}
          {copied === "message" ? copy.copied : copy.copyMessage}
        </button>
      </div>

      {canShare ? (
        <>
          <button
            type="button"
            onClick={shareFromPhone}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
          >
            <Smartphone aria-hidden className="size-4" />
            {copy.phone}
          </button>
          <p className="mt-2 text-xs text-black/45">{copy.phoneHint}</p>
        </>
      ) : null}

      <a
        href={imageUrl}
        download={`${id}-${lang}.png`}
        className={cn(actionClass, "mt-2 w-full")}
      >
        <Download aria-hidden className="size-4" />
        {copy.download}
      </a>
      <p className="mt-2 text-xs text-black/45">{copy.downloadHint}</p>
    </section>
  );
}

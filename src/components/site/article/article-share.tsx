"use client";

import { Check, Link2, Mail, MessageCircle, Share2 } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { trackShare } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";

type ShareLabels = {
  share: string;
  copyLink: string;
  copied: string;
  shareMore: string;
  emailShare: string;
  whatsappShare: string;
};

const noSubscribe = () => () => {};

const buttonClass =
  "relative grid size-10 place-items-center rounded-full bg-mist text-black/65 transition-colors hover:bg-brand hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25";

/**
 * Share buttons: copy link, WhatsApp, email, and the device's share sheet when the
 * browser has one. No brand icons (Lucide only), so each button has a clear label.
 */
export function ArticleShare({
  url,
  title,
  labels,
  className,
}: {
  /** Absolute URL of the article. */
  url: string;
  title: string;
  labels: ShareLabels;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  // The share sheet only exists in some browsers; the server render assumes it does not.
  const canShare = useSyncExternalStore(
    noSubscribe,
    () => typeof navigator.share === "function",
    () => false,
  );

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const text = encodeURIComponent(`${title} ${url}`);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="sr-only">{labels.share}</span>
      <button
        type="button"
        aria-label={labels.copyLink}
        title={labels.copyLink}
        onClick={() => {
          navigator.clipboard?.writeText(url).then(
            () => {
              setCopied(true);
              trackShare("copy");
            },
            () => {},
          );
        }}
        className={buttonClass}
      >
        {copied ? (
          <Check aria-hidden className="size-4" />
        ) : (
          <Link2 aria-hidden className="size-4" />
        )}
        <span
          role="status"
          className={cn(
            "pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-ink px-2 py-1 text-xs font-medium whitespace-nowrap text-white transition-opacity",
            copied ? "opacity-100" : "opacity-0",
          )}
        >
          {copied ? labels.copied : ""}
        </span>
      </button>
      <a
        href={`https://wa.me/?text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={labels.whatsappShare}
        title={labels.whatsappShare}
        onClick={() => trackShare("whatsapp")}
        className={buttonClass}
      >
        <MessageCircle aria-hidden className="size-4" />
      </a>
      <a
        href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
        aria-label={labels.emailShare}
        title={labels.emailShare}
        onClick={() => trackShare("email")}
        className={buttonClass}
      >
        <Mail aria-hidden className="size-4" />
      </a>
      {canShare ? (
        <button
          type="button"
          aria-label={labels.shareMore}
          title={labels.shareMore}
          onClick={() => {
            navigator
              .share({ title, url })
              .then(() => trackShare("native"))
              .catch(() => {});
          }}
          className={buttonClass}
        >
          <Share2 aria-hidden className="size-4" />
        </button>
      ) : null}
    </div>
  );
}

"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Small button that copies the email address and shows a "Copied" bubble for a moment. */
export function CopyEmail({
  email,
  label,
  copiedLabel,
}: {
  email: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        navigator.clipboard?.writeText(email).then(
          () => setCopied(true),
          () => {},
        );
      }}
      className="relative grid size-7 place-items-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white"
    >
      {copied ? (
        <Check aria-hidden className="size-4 text-brand-soft" />
      ) : (
        <Copy aria-hidden className="size-4" />
      )}
      <span
        role="status"
        className={cn(
          "pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-white px-2 py-0.5 text-xs font-medium text-ink transition-opacity",
          copied ? "opacity-100" : "opacity-0",
        )}
      >
        {copied ? copiedLabel : ""}
      </span>
    </button>
  );
}

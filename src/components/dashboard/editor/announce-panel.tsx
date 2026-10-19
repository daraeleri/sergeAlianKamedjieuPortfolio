"use client";

import { CircleCheck, Loader2, Send } from "lucide-react";
import { useState, useTransition } from "react";
import { announce } from "@/app/actions/newsletter";
import { fill } from "@/components/dashboard/ui";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Announcement } from "@/lib/dashboard/types";

type Copy = Dictionary["dashboard"]["editor"]["announce"];

/**
 * Editor side panel: emails a published article or book to the newsletter subscribers,
 * once. Shows when it was sent afterwards. Never sends on its own: saving or publishing
 * doesn't email anyone until this button is pressed.
 */
export function AnnouncePanel({
  kind,
  id,
  published,
  busy,
  announced,
  subscribers,
  copy,
  locale,
}: {
  kind: "article" | "book";
  /** Database id, or null while the record has never been saved. */
  id: string | null;
  published: boolean;
  /** True while a save is in flight (send after it lands). */
  busy: boolean;
  announced?: Announcement;
  subscribers: number;
  copy: Copy;
  locale: string;
}) {
  const [sent, setSent] = useState<Announcement | undefined>(announced);
  const [queued, setQueued] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  const send = () => {
    if (!id || !window.confirm(fill(copy.confirm, { count: subscribers }))) return;
    setError(null);
    startTransition(async () => {
      try {
        const result = await announce(kind, id);
        if (result.ok) {
          setQueued(result.total);
          setSent({ at: new Date().toISOString(), to: result.total });
        } else {
          setError(copy.errors[result.error]);
        }
      } catch {
        setError(copy.errors.failed);
      }
    });
  };

  let body: React.ReactNode;
  if (queued !== null) {
    body = <Note>{fill(copy.queued, { count: queued })}</Note>;
  } else if (sent) {
    body = <Note>{fill(copy.sent, { count: sent.to, date: date.format(new Date(sent.at)) })}</Note>;
  } else if (!published) {
    body = <p className="mt-1.5 text-sm text-black/55">{copy.publishFirst}</p>;
  } else if (!subscribers) {
    body = <p className="mt-1.5 text-sm text-black/55">{copy.textNone}</p>;
  } else {
    body = (
      <>
        <p className="mt-1.5 text-sm text-black/55">{fill(copy.text, { count: subscribers })}</p>
        <button
          type="button"
          onClick={send}
          disabled={pending || busy || !id}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
        >
          {pending ? (
            <Loader2 aria-hidden className="size-4 animate-spin" />
          ) : (
            <Send aria-hidden className="size-4" />
          )}
          {pending ? copy.sending : copy.button}
        </button>
      </>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
      <h2 className="text-sm font-medium">{copy.title}</h2>
      {body}
      {error ? (
        <p role="alert" className="mt-3 text-sm text-rose-600">
          {error}
        </p>
      ) : null}
    </section>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p role="status" className="mt-2 flex items-start gap-2 text-sm text-emerald-700">
      <CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0" />
      {children}
    </p>
  );
}

"use client";

import { CircleAlert, CircleCheck, Loader2, ShieldCheck } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { confirmSubscription, unsubscribeFromNewsletter } from "@/app/actions/newsletter";
import type { Dictionary } from "@/i18n/get-dictionary";
import { envelopeSvg } from "@/lib/newsletter-art";
import { cn } from "@/lib/utils";

type Copy = Dictionary["newsletter"];
type Links = { home: Route; articles: Route };
type Tone = "ok" | "error" | "busy" | "neutral";

/** The token sits after "#" in email links, so it stays out of server logs. */
function readToken() {
  return decodeURIComponent(window.location.hash.slice(1));
}

const primary =
  "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-sm font-medium text-white shadow-[0_10px_24px_-12px] shadow-brand transition-colors hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-70";
const secondary =
  "inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-black/60 ring-1 ring-black/10 transition-colors hover:bg-mist hover:text-ink";

const badges: Record<Tone, { icon: typeof CircleCheck; className: string } | null> = {
  ok: { icon: CircleCheck, className: "bg-emerald-50 text-emerald-700 ring-emerald-600/15" },
  error: { icon: CircleAlert, className: "bg-rose-50 text-rose-700 ring-rose-600/15" },
  busy: { icon: Loader2, className: "bg-brand-tint text-brand-strong ring-brand/15" },
  neutral: null,
};

/**
 * Newsletter card: the envelope illustration across the top, fading into white, then a
 * status chip, title, text, actions and a small reassurance line.
 */
function NewsletterCard({
  tone,
  status,
  title,
  text,
  note,
  children,
}: {
  tone: Tone;
  status?: string;
  title: string;
  text?: string;
  note?: string;
  children?: React.ReactNode;
}) {
  const badge = badges[tone];
  return (
    <div className="w-full max-w-[26rem] animate-fade-up overflow-hidden rounded-[1.75rem] bg-white shadow-[0_40px_80px_-40px_rgb(10_10_10/0.35)] ring-1 ring-black/5">
      <div
        aria-hidden
        className="[&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
        // Static illustration from our own code.
        dangerouslySetInnerHTML={{ __html: envelopeSvg }}
      />
      <div className="px-7 pt-1 pb-8 text-center sm:px-9">
        {badge && status ? (
          <p
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1",
              badge.className,
            )}
          >
            <badge.icon aria-hidden className={cn("size-3.5", tone === "busy" && "animate-spin")} />
            {status}
          </p>
        ) : null}
        <h1
          className={cn(
            "font-heading text-[1.75rem] leading-tight font-semibold tracking-tight text-balance",
            badge && status && "mt-4",
          )}
        >
          {title}
        </h1>
        {text ? (
          <p className="mx-auto mt-3 max-w-xs leading-relaxed text-pretty text-black/60">{text}</p>
        ) : null}
        {children ? <div className="mt-7 flex flex-col gap-3">{children}</div> : null}
        {note ? (
          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-black/45">
            <ShieldCheck aria-hidden className="size-3.5" />
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** Confirms the subscription as soon as the page opens. */
export function ConfirmSubscription({ copy, links }: { copy: Copy; links: Links }) {
  const c = copy.confirm;
  const [result, setResult] = useState<"checking" | "confirmed" | "already" | "invalid">(
    "checking",
  );

  useEffect(() => {
    const token = readToken();
    (token ? confirmSubscription(token) : Promise.resolve("invalid" as const))
      .then(setResult)
      .catch(() => setResult("invalid"));
  }, []);

  if (result === "checking") {
    return <NewsletterCard tone="busy" status={copy.status.checking} title={c.checking} />;
  }
  if (result === "invalid") {
    return (
      <NewsletterCard
        tone="error"
        status={copy.status.error}
        title={c.invalid}
        text={c.invalidText}
      >
        <Link href={links.home} className={primary}>
          {copy.backHome}
        </Link>
      </NewsletterCard>
    );
  }
  return (
    <NewsletterCard
      tone="ok"
      status={copy.status.confirmed}
      title={result === "confirmed" ? c.confirmed : c.already}
      text={result === "confirmed" ? c.confirmedText : c.alreadyText}
      note={copy.privacy}
    >
      <Link href={links.articles} className={primary}>
        {copy.readArticles}
      </Link>
      <Link href={links.home} className={secondary}>
        {copy.backHome}
      </Link>
    </NewsletterCard>
  );
}

/** Asks for a click before unsubscribing (link scanners open every URL in an email). */
export function Unsubscribe({ copy, links }: { copy: Copy; links: Links }) {
  const c = copy.unsubscribe;
  const [result, setResult] = useState<"ask" | "done" | "invalid">("ask");
  const [pending, startTransition] = useTransition();

  const submit = () =>
    startTransition(async () => {
      const token = readToken();
      const ok = token ? await unsubscribeFromNewsletter(token).catch(() => false) : false;
      setResult(ok ? "done" : "invalid");
    });

  if (result === "done") {
    return (
      <NewsletterCard tone="ok" status={copy.status.unsubscribed} title={c.done} text={c.doneText}>
        <Link href={links.home} className={primary}>
          {copy.backHome}
        </Link>
      </NewsletterCard>
    );
  }
  if (result === "invalid") {
    return (
      <NewsletterCard
        tone="error"
        status={copy.status.error}
        title={c.invalid}
        text={c.invalidText}
      >
        <Link href={links.home} className={primary}>
          {copy.backHome}
        </Link>
      </NewsletterCard>
    );
  }
  return (
    <NewsletterCard tone="neutral" title={c.title} text={c.text} note={c.note}>
      <button type="button" onClick={submit} disabled={pending} className={primary}>
        {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
        {pending ? c.working : c.button}
      </button>
      <Link href={links.home} className={secondary}>
        {c.keep}
      </Link>
    </NewsletterCard>
  );
}

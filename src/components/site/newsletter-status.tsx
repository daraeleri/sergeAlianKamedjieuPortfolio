"use client";

import { CircleAlert, CircleCheck, Loader2, MailX } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { confirmSubscription, unsubscribeFromNewsletter } from "@/app/actions/newsletter";
import type { Dictionary } from "@/i18n/get-dictionary";

type Copy = Dictionary["newsletter"];
type Links = { home: Route; articles: Route };

/** The token sits after "#" in email links, so it stays out of server logs. */
function readToken() {
  return decodeURIComponent(window.location.hash.slice(1));
}

function Card({
  tone,
  title,
  text,
  children,
}: {
  tone: "ok" | "error" | "busy" | "neutral";
  title: string;
  text?: string;
  children?: React.ReactNode;
}) {
  const Icon =
    tone === "ok"
      ? CircleCheck
      : tone === "error"
        ? CircleAlert
        : tone === "busy"
          ? Loader2
          : MailX;
  return (
    <div className="w-full max-w-md animate-fade-up rounded-3xl bg-white p-8 text-center shadow-xl ring-1 shadow-black/[0.04] ring-black/5">
      <span
        className={
          tone === "error"
            ? "mx-auto grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-600"
            : "mx-auto grid size-12 place-items-center rounded-2xl bg-brand-tint text-brand"
        }
      >
        <Icon aria-hidden className={tone === "busy" ? "size-6 animate-spin" : "size-6"} />
      </span>
      <h1 className="mt-5 font-heading text-2xl font-semibold tracking-tight">{title}</h1>
      {text ? <p className="mt-2 leading-relaxed text-black/60">{text}</p> : null}
      {children ? <div className="mt-6 flex flex-col gap-3">{children}</div> : null}
    </div>
  );
}

const primary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-70";
const secondary = "text-sm font-medium text-black/55 hover:text-brand-strong";

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

  if (result === "checking") return <Card tone="busy" title={c.checking} />;
  if (result === "invalid") {
    return (
      <Card tone="error" title={c.invalid} text={c.invalidText}>
        <Link href={links.home} className={primary}>
          {copy.backHome}
        </Link>
      </Card>
    );
  }
  return (
    <Card
      tone="ok"
      title={result === "confirmed" ? c.confirmed : c.already}
      text={result === "confirmed" ? c.confirmedText : c.alreadyText}
    >
      <Link href={links.articles} className={primary}>
        {copy.readArticles}
      </Link>
      <Link href={links.home} className={secondary}>
        {copy.backHome}
      </Link>
    </Card>
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
      <Card tone="ok" title={c.done} text={c.doneText}>
        <Link href={links.home} className={primary}>
          {copy.backHome}
        </Link>
      </Card>
    );
  }
  if (result === "invalid") {
    return (
      <Card tone="error" title={c.invalid} text={c.invalidText}>
        <Link href={links.home} className={primary}>
          {copy.backHome}
        </Link>
      </Card>
    );
  }
  return (
    <Card tone="neutral" title={c.title} text={c.text}>
      <button type="button" onClick={submit} disabled={pending} className={primary}>
        {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
        {pending ? c.working : c.button}
      </button>
      <Link href={links.home} className={secondary}>
        {copy.backHome}
      </Link>
    </Card>
  );
}

"use client";

import { ArrowRight, CircleCheck, Loader2 } from "lucide-react";
import { useActionState, useId } from "react";
import { subscribeToNewsletter, type SubscribeState } from "@/app/actions/newsletter";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

type Copy = Dictionary["footer"]["newsletter"];

/**
 * Footer newsletter sign-up: heading on the left, email field and button on the right.
 * After sending, the form is replaced by "check your inbox" (double opt-in).
 */
export function NewsletterForm({ copy, locale }: { copy: Copy; locale: Locale }) {
  const [state, action, pending] = useActionState<SubscribeState, FormData>(subscribeToNewsletter, {
    status: "idle",
  });
  const ids = { email: useId(), title: useId(), status: useId() };
  const invalid = state.status === "invalid";

  return (
    <section
      aria-labelledby={ids.title}
      className="mt-16 grid gap-6 rounded-3xl bg-white/[0.04] p-6 ring-1 ring-white/10 sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12"
    >
      <div>
        <p className="text-xs font-semibold tracking-[0.14em] text-brand-soft uppercase">
          {copy.label}
        </p>
        <h2 id={ids.title} className="mt-2 font-heading text-2xl font-semibold tracking-tight">
          {copy.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/55">{copy.intro}</p>
      </div>

      {state.status === "success" ? (
        <p
          role="status"
          className="flex items-start gap-3 rounded-2xl bg-brand/15 p-4 text-sm leading-relaxed text-white ring-1 ring-brand-soft/30"
        >
          <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-soft" />
          {copy.success}
        </p>
      ) : (
        <form action={action} noValidate>
          <input type="hidden" name="locale" value={locale} />
          {/* Honeypot, hidden from people. */}
          <div aria-hidden className="absolute -left-[9999px]">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <label htmlFor={ids.email} className="sr-only">
            {copy.emailLabel}
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id={ids.email}
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              defaultValue={state.email}
              placeholder={copy.placeholder}
              aria-invalid={invalid || undefined}
              aria-describedby={state.status !== "idle" ? ids.status : undefined}
              className={cn(
                "min-w-0 flex-1 rounded-xl bg-white/[0.06] px-4 py-3 text-white ring-1 ring-white/15 outline-none placeholder:text-white/35 focus:ring-2 focus:ring-brand-soft",
                invalid && "ring-rose-400",
              )}
            />
            <button
              type="submit"
              disabled={pending}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-70"
            >
              {pending ? (
                <>
                  <Loader2 aria-hidden className="size-4 animate-spin" />
                  {copy.sending}
                </>
              ) : (
                <>
                  {copy.submit}
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </div>
          {state.status === "invalid" || state.status === "error" ? (
            <p id={ids.status} role="alert" className="mt-2 text-sm text-rose-300">
              {state.status === "invalid" ? copy.invalid : copy.error}
            </p>
          ) : null}
        </form>
      )}
    </section>
  );
}

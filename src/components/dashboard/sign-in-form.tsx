"use client";

import { CircleAlert, LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { signIn } from "@/app/actions/auth";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

const field =
  "mt-1.5 block w-full rounded-xl border-0 bg-mist px-3.5 py-2.5 text-sm ring-1 ring-black/5 transition outline-none placeholder:text-black/35 focus:bg-white focus:ring-2 focus:ring-brand";

export function SignInForm({ locale, copy }: { locale: Locale; copy: Dictionary["auth"] }) {
  const [state, action, pending] = useActionState(signIn, undefined);
  const next = useSearchParams().get("next") ?? "";

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="lang" value={locale} />
      <input type="hidden" name="next" value={next} />

      {state?.error ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700 ring-1 ring-red-600/10"
        >
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {copy[state.error]}
        </p>
      ) : null}

      <label className="block text-sm font-medium">
        {copy.email}
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          defaultValue={state?.email}
          className={field}
        />
      </label>
      <label className="block text-sm font-medium">
        {copy.password}
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={field}
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-70"
      >
        {pending ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : null}
        {pending ? copy.submitting : copy.submit}
      </button>
    </form>
  );
}

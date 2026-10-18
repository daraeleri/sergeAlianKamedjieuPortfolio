"use client";

import { CircleCheck, LoaderCircle, Send } from "lucide-react";
import { useActionState, useId, useState } from "react";
import { sendContactMessage } from "@/app/actions/contact";
import type { Dictionary } from "@/i18n/get-dictionary";
import { requestTypes, type ContactField, type ContactState } from "@/lib/contact";
import { cn } from "@/lib/utils";

type FormCopy = Dictionary["contact"]["form"];

/** Contact form card. Remounting (new key) after a success gives a fresh, empty form. */
export function ContactForm({ copy, email }: { copy: FormCopy; email: string }) {
  const [round, setRound] = useState(0);
  return (
    <ContactFormInner
      key={round}
      copy={copy}
      email={email}
      onReset={() => setRound((n) => n + 1)}
    />
  );
}

const initialState: ContactState = { status: "idle" };

function ContactFormInner({
  copy,
  email,
  onReset,
}: {
  copy: FormCopy;
  email: string;
  onReset: () => void;
}) {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const id = useId();

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex min-h-[28rem] flex-col items-center justify-center text-center"
      >
        <span className="grid size-16 place-items-center rounded-full bg-brand-tint text-brand">
          <CircleCheck aria-hidden strokeWidth={1.75} className="size-8" />
        </span>
        <h3 className="mt-6 font-heading text-2xl font-semibold tracking-tight">
          {copy.successTitle}
        </h3>
        <p className="mt-3 max-w-sm leading-relaxed text-black/60">{copy.successText}</p>
        <button
          type="button"
          onClick={onReset}
          className="mt-8 rounded-xl bg-ink px-5 py-3 font-medium text-white transition-colors hover:bg-brand"
        >
          {copy.sendAnother}
        </button>
      </div>
    );
  }

  const invalid = new Set<ContactField>(state.status === "invalid" ? state.fields : []);
  const values = state.status === "invalid" || state.status === "error" ? state.values : {};
  const fieldId = (name: string) => `${id}-${name}`;
  const errorId = (name: ContactField) => `${id}-${name}-error`;
  const describe = (name: ContactField) => (invalid.has(name) ? errorId(name) : undefined);

  const inputClass = (name?: ContactField) =>
    cn(
      "mt-2 w-full rounded-xl border bg-mist px-4 py-2.5 text-ink outline-none transition-colors placeholder:text-black/35 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15",
      name && invalid.has(name) ? "border-red-500" : "border-black/10",
    );

  return (
    <form action={formAction} noValidate className="space-y-5">
      <h3 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
        {copy.title}
      </h3>

      {/* Honeypot for bots: hidden from people and assistive technology. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={fieldId("website")}>Website</label>
        <input
          id={fieldId("website")}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId("name")} className="text-sm font-medium">
            {copy.name}
          </label>
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            defaultValue={values.name}
            aria-invalid={invalid.has("name") || undefined}
            aria-describedby={describe("name")}
            className={inputClass("name")}
          />
          <FieldError id={errorId("name")} show={invalid.has("name")} text={copy.errors.name} />
        </div>
        <div>
          <label htmlFor={fieldId("email")} className="text-sm font-medium">
            {copy.email}
          </label>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            defaultValue={values.email}
            aria-invalid={invalid.has("email") || undefined}
            aria-describedby={describe("email")}
            className={inputClass("email")}
          />
          <FieldError id={errorId("email")} show={invalid.has("email")} text={copy.errors.email} />
        </div>
      </div>

      <div>
        <label htmlFor={fieldId("organization")} className="text-sm font-medium">
          {copy.organization} <span className="font-normal text-black/45">({copy.optional})</span>
        </label>
        <input
          id={fieldId("organization")}
          name="organization"
          type="text"
          autoComplete="organization"
          maxLength={150}
          defaultValue={values.organization}
          className={inputClass()}
        />
      </div>

      <fieldset aria-describedby={describe("type")}>
        <legend className="text-sm font-medium">{copy.type}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {requestTypes.map((type) => (
            <label key={type} className="cursor-pointer">
              <input
                type="radio"
                name="type"
                value={type}
                defaultChecked={(values.type ?? "invitation") === type}
                className="peer sr-only"
              />
              <span className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/70 transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-brand/25 hover:border-brand/40">
                {copy.types[type]}
              </span>
            </label>
          ))}
        </div>
        <FieldError id={errorId("type")} show={invalid.has("type")} text={copy.errors.type} />
      </fieldset>

      <div>
        <label htmlFor={fieldId("message")} className="text-sm font-medium">
          {copy.message}
        </label>
        <textarea
          id={fieldId("message")}
          name="message"
          required
          rows={5}
          maxLength={5000}
          placeholder={copy.messagePlaceholder}
          defaultValue={values.message}
          aria-invalid={invalid.has("message") || undefined}
          aria-describedby={describe("message")}
          className={cn(inputClass("message"), "resize-y")}
        />
        <FieldError
          id={errorId("message")}
          show={invalid.has("message")}
          text={copy.errors.message}
        />
      </div>

      {state.status === "error" ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.reason === "unavailable"
            ? copy.errors.unavailable.replace("{email}", email)
            : copy.errors.generic}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-black/50">{copy.privacy}</p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? (
            <>
              <LoaderCircle aria-hidden className="size-4 animate-spin" />
              {copy.sending}
            </>
          ) : (
            <>
              {copy.submit}
              <Send aria-hidden className="size-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function FieldError({ id, show, text }: { id: string; show: boolean; text: string }) {
  if (!show) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-red-600">
      {text}
    </p>
  );
}

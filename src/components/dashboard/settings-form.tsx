"use client";

import { CircleCheck, Save } from "lucide-react";
import Image from "next/image";
import { useId, useState, type FormEvent } from "react";
import { Field, fieldClass, useLocalDraft } from "@/components/dashboard/editor/editor-parts";
import type { Dictionary } from "@/i18n/get-dictionary";

type Values = { name: string; role: string; email: string; location: string; jafanUrl: string };

/**
 * Profile and site details. Saved in this browser (sample) until the database is
 * connected; then these values will replace `siteConfig` on the public site.
 */
export function SettingsForm({
  initial,
  avatar,
  copy,
}: {
  initial: Values;
  avatar: string;
  copy: Dictionary["dashboard"]["settings"];
}) {
  const local = useLocalDraft("settings");
  const [values, setValues] = useState<Values>(initial);
  const [saved, setSaved] = useState(false);
  const ids = {
    name: useId(),
    role: useId(),
    email: useId(),
    location: useId(),
    jafanUrl: useId(),
  };

  const set = (key: keyof Values, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    local.save(values);
    setSaved(true);
  };

  const section =
    "grid gap-6 rounded-2xl bg-white p-5 ring-1 ring-black/5 sm:p-6 lg:grid-cols-[16rem_minmax(0,1fr)]";

  return (
    <form onSubmit={submit} className="space-y-4">
      <section className={section}>
        <div>
          <h2 className="text-sm font-semibold">{copy.profile}</h2>
          <p className="mt-1 text-xs text-black/50">{copy.profileText}</p>
        </div>
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <span className="relative size-16 overflow-hidden rounded-2xl bg-brand-tint">
              <Image
                src={avatar}
                alt=""
                fill
                sizes="64px"
                className="origin-[50%_10%] scale-[1.8] object-cover object-top"
              />
            </span>
            <div>
              <p className="font-heading text-lg font-semibold">{values.name}</p>
              <p className="text-sm text-black/50">{values.role}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={copy.name} htmlFor={ids.name}>
              <input
                id={ids.name}
                value={values.name}
                onChange={(event) => set("name", event.target.value)}
                className={fieldClass}
                autoComplete="name"
              />
            </Field>
            <Field label={copy.role} htmlFor={ids.role}>
              <input
                id={ids.role}
                value={values.role}
                onChange={(event) => set("role", event.target.value)}
                className={fieldClass}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className={section}>
        <div>
          <h2 className="text-sm font-semibold">{copy.site}</h2>
          <p className="mt-1 text-xs text-black/50">{copy.siteText}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={copy.email} htmlFor={ids.email}>
            <input
              id={ids.email}
              type="email"
              value={values.email}
              onChange={(event) => set("email", event.target.value)}
              className={fieldClass}
              autoComplete="email"
            />
          </Field>
          <Field label={copy.location} htmlFor={ids.location}>
            <input
              id={ids.location}
              value={values.location}
              onChange={(event) => set("location", event.target.value)}
              className={fieldClass}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label={copy.jafanUrl} htmlFor={ids.jafanUrl}>
              <input
                id={ids.jafanUrl}
                type="url"
                value={values.jafanUrl}
                onChange={(event) => set("jafanUrl", event.target.value)}
                className={fieldClass}
              />
            </Field>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {saved ? (
          <p role="status" className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
            <CircleCheck aria-hidden className="size-4" />
            {copy.saved}
          </p>
        ) : null}
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-strong"
        >
          <Save aria-hidden className="size-4" />
          {copy.save}
        </button>
      </div>
    </form>
  );
}

"use client";

import { ArrowLeft, History } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { fill } from "@/components/dashboard/ui";
import { BookCard } from "@/components/site/book-card";
import type { Dictionary } from "@/i18n/get-dictionary";
import { bookReadiness } from "@/lib/dashboard/readiness";
import { contentStatuses, type BookDoc } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";
import {
  CompactReadiness,
  CoverField,
  Field,
  fieldClass,
  LanguageTabs,
  ReadinessPanel,
  useLocalDraft,
  type EditLocale,
} from "./editor-parts";

type Draft = Pick<
  BookDoc,
  "status" | "title" | "description" | "tags" | "cover" | "pages" | "year"
>;

/**
 * Book editor: title, bilingual description, topics, pages, year and cover, with a live
 * preview of the book as it will appear on the site's shelf, and the publish-readiness
 * panel. Drafts autosave in this browser until the database is connected.
 */
export function BookEditor({
  id,
  initial,
  updatedAt,
  copy,
  locale,
  backHref,
  author,
  orderLabel,
}: {
  id: string;
  initial: Draft;
  updatedAt?: string;
  copy: Dictionary["dashboard"];
  locale: string;
  backHref: Route;
  author: string;
  orderLabel: string;
}) {
  const editor = copy.editor;
  const [draft, setDraft] = useState<Draft>(initial);
  const [tagsText, setTagsText] = useState(initial.tags.join(", "));
  const [lang, setLang] = useState<EditLocale>(locale === "fr" ? "fr" : "en");
  const [pending, setPending] = useState(false);
  const [published, setPublished] = useState(initial.status === "published");
  const [restored, setRestored] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const local = useLocalDraft(`book:${id}`);
  const ids = {
    title: useId(),
    description: useId(),
    tags: useId(),
    pages: useId(),
    year: useId(),
    status: useId(),
  };

  const readiness = bookReadiness(draft);
  const time = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" });

  const save = (value: Draft) => {
    window.clearTimeout(timer.current);
    local.save(value);
    setPending(false);
  };
  const update = (patch: Partial<Draft>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    setPending(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => save(next), 800);
  };
  const toNumber = (value: string) => (value ? Number(value) : undefined);

  const newerLocal =
    !restored &&
    local.saved &&
    local.saved.savedAt > (updatedAt ? Date.parse(updatedAt) : 0) &&
    JSON.stringify(local.saved.value) !== JSON.stringify(draft);

  const publish = () => {
    const next = { ...draft, status: "published" as const };
    setDraft(next);
    save(next);
    setPublished(true);
  };

  const savedLabel = pending
    ? editor.saving
    : local.saved
      ? fill(editor.savedAt, { time: time.format(local.saved.savedAt) })
      : editor.notSaved;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-black/55 hover:text-brand-strong"
        >
          <ArrowLeft aria-hidden className="size-4" />
          {copy.nav.books}
        </Link>
        <LanguageTabs
          value={lang}
          onChange={setLang}
          copy={editor}
          done={{
            en: Boolean(draft.description.en.trim()),
            fr: Boolean(draft.description.fr.trim()),
          }}
        />
      </div>

      {newerLocal ? (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-600/15">
          <History aria-hidden className="size-4" />
          {editor.restore}
          <button
            type="button"
            onClick={() => {
              const value = local.saved!.value as Draft;
              setDraft(value);
              setTagsText(value.tags.join(", "));
              setRestored(true);
            }}
            className="ml-auto rounded-lg bg-white px-3 py-1 text-xs font-semibold ring-1 ring-amber-600/20 hover:bg-amber-100"
          >
            {editor.restoreAction}
          </button>
        </div>
      ) : null}
      {local.error ? (
        <p role="alert" className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {editor.storageFull}
        </p>
      ) : null}

      <CompactReadiness
        readiness={readiness}
        copy={editor}
        savedLabel={savedLabel}
        onSave={() => save(draft)}
        onPublish={publish}
        published={published}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <section className="grid gap-6 rounded-2xl bg-white p-5 ring-1 ring-black/5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:p-6">
            <CoverField
              value={draft.cover}
              onChange={(cover) => update({ cover })}
              copy={editor}
              aspect="aspect-[2/3]"
            />
            <div className="space-y-5">
              <Field label={editor.fields.title} htmlFor={ids.title}>
                <input
                  id={ids.title}
                  value={draft.title}
                  onChange={(event) => update({ title: event.target.value })}
                  placeholder={editor.fields.bookTitlePlaceholder}
                  className={cn(fieldClass, "font-heading text-lg font-semibold")}
                />
              </Field>
              <Field
                label={`${editor.fields.description} · ${editor.languages[lang]}`}
                hint={editor.fields.descriptionHint}
                htmlFor={ids.description}
              >
                <textarea
                  id={ids.description}
                  value={draft.description[lang]}
                  onChange={(event) =>
                    update({ description: { ...draft.description, [lang]: event.target.value } })
                  }
                  rows={4}
                  className={cn(fieldClass, "[field-sizing:content] resize-none")}
                />
                <p
                  className={cn(
                    "mt-1 text-right text-xs tabular-nums",
                    draft.description[lang].trim().length >= 80
                      ? "text-emerald-600"
                      : "text-black/40",
                  )}
                >
                  {draft.description[lang].trim().length}/80
                </p>
              </Field>
              <Field label={editor.fields.tags} hint={editor.fields.tagsHint} htmlFor={ids.tags}>
                <input
                  id={ids.tags}
                  value={tagsText}
                  onChange={(event) => {
                    setTagsText(event.target.value);
                    update({
                      tags: event.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    });
                  }}
                  className={fieldClass}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label={editor.fields.pages} htmlFor={ids.pages}>
                  <input
                    id={ids.pages}
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={draft.pages ?? ""}
                    onChange={(event) => update({ pages: toNumber(event.target.value) })}
                    className={fieldClass}
                  />
                </Field>
                <Field label={editor.fields.year} htmlFor={ids.year}>
                  <input
                    id={ids.year}
                    type="number"
                    min={1990}
                    max={2100}
                    inputMode="numeric"
                    value={draft.year ?? ""}
                    onChange={(event) => update({ year: toNumber(event.target.value) })}
                    className={fieldClass}
                  />
                </Field>
              </div>
            </div>
          </section>
        </div>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <ReadinessPanel
            readiness={readiness}
            copy={editor}
            savedLabel={savedLabel}
            onSave={() => save(draft)}
            onPublish={publish}
            published={published}
          >
            <section className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
              <label htmlFor={ids.status} className="text-sm font-medium">
                {editor.fields.status}
              </label>
              <select
                id={ids.status}
                value={draft.status}
                onChange={(event) => update({ status: event.target.value as Draft["status"] })}
                className={cn(fieldClass, "mt-2")}
              >
                {contentStatuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                    disabled={status === "published" && !readiness.ready}
                  >
                    {copy.status[status]}
                  </option>
                ))}
              </select>
            </section>

            {/* Live preview, as on the site's shelf */}
            <section
              aria-hidden
              className="pointer-events-none rounded-2xl bg-white p-5 ring-1 ring-black/5"
            >
              <BookCard
                book={{
                  slug: id,
                  title: draft.title || editor.fields.bookTitlePlaceholder,
                  description: draft.description[lang],
                  tags: draft.tags,
                  cover: draft.cover,
                }}
                coverAlt=""
                orderLabel={orderLabel}
                orderHref={backHref}
                author={author}
              />
            </section>
          </ReadinessPanel>
        </aside>
      </div>
    </div>
  );
}

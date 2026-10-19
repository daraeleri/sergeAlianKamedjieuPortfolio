"use client";

import { ArrowLeft, History } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { articleThemes } from "@/components/site/article-card";
import { fill } from "@/components/dashboard/ui";
import type { ArticleTheme } from "@/content/articles";
import type { Dictionary } from "@/i18n/get-dictionary";
import { articleReadiness, countWords } from "@/lib/dashboard/readiness";
import { contentStatuses, type ArticleDoc } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";
import { BlockEditor } from "./block-editor";
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

type Draft = Pick<ArticleDoc, "status" | "category" | "title" | "excerpt" | "cover" | "body">;

/**
 * Article editor: bilingual fields (EN / FR tabs), cover, Medium-style block body, and a
 * sticky publish-readiness panel that updates as you write. Drafts autosave in this
 * browser until the database is connected.
 */
export function ArticleEditor({
  id,
  initial,
  updatedAt,
  copy,
  locale,
  backHref,
}: {
  id: string;
  initial: Draft;
  /** Last server update (ISO), to know whether the local draft is newer. */
  updatedAt?: string;
  copy: Dictionary["dashboard"];
  locale: string;
  backHref: Route;
}) {
  const editor = copy.editor;
  const [draft, setDraft] = useState<Draft>(initial);
  const [lang, setLang] = useState<EditLocale>(locale === "fr" ? "fr" : "en");
  const [pending, setPending] = useState(false);
  const [published, setPublished] = useState(initial.status === "published");
  const [restored, setRestored] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const local = useLocalDraft(`article:${id}`);
  const ids = { title: useId(), category: useId(), excerpt: useId(), status: useId() };

  const readiness = articleReadiness(draft);
  const words = countWords(draft.body[lang]);
  const time = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" });

  const save = (value: Draft) => {
    window.clearTimeout(timer.current);
    local.save(value);
    setPending(false);
  };
  // Every change autosaves after a short pause.
  const update = (patch: Partial<Draft>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    setPending(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => save(next), 800);
  };
  const setText = (field: "title" | "excerpt" | "category", value: string) =>
    update({ [field]: { ...draft[field], [lang]: value } });

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

  const themed = draft.cover?.startsWith("theme:")
    ? articleThemes[draft.cover.slice(6) as ArticleTheme]
    : undefined;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-black/55 hover:text-brand-strong"
        >
          <ArrowLeft aria-hidden className="size-4" />
          {copy.nav.articles}
        </Link>
        <LanguageTabs
          value={lang}
          onChange={setLang}
          copy={editor}
          done={{ en: Boolean(draft.title.en.trim()), fr: Boolean(draft.title.fr.trim()) }}
        />
      </div>

      {newerLocal ? (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-600/15">
          <History aria-hidden className="size-4" />
          {editor.restore}
          <button
            type="button"
            onClick={() => {
              setDraft(local.saved!.value as Draft);
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
          <CoverField
            value={draft.cover}
            onChange={(cover) => update({ cover })}
            copy={editor}
            preview={
              themed ? (
                <div
                  className={cn(
                    "absolute inset-0 grid place-items-center text-white",
                    themed.className,
                  )}
                >
                  <themed.icon aria-hidden strokeWidth={1} className="size-20 opacity-50" />
                </div>
              ) : null
            }
          />

          {/* Title, Medium style */}
          <div>
            <label htmlFor={ids.title} className="sr-only">
              {editor.fields.title}
            </label>
            <textarea
              id={ids.title}
              value={draft.title[lang]}
              onChange={(event) => setText("title", event.target.value.replace(/\n/g, " "))}
              placeholder={editor.fields.titlePlaceholder}
              rows={1}
              className="[field-sizing:content] w-full resize-none bg-transparent font-heading text-3xl leading-tight font-semibold tracking-tight outline-none placeholder:text-black/25 sm:text-4xl"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-[14rem_minmax(0,1fr)]">
            <Field label={editor.fields.category} htmlFor={ids.category}>
              <input
                id={ids.category}
                value={draft.category[lang]}
                onChange={(event) => setText("category", event.target.value)}
                placeholder={editor.fields.categoryPlaceholder}
                className={fieldClass}
              />
            </Field>
            <Field
              label={editor.fields.excerpt}
              hint={editor.fields.excerptHint}
              htmlFor={ids.excerpt}
            >
              <textarea
                id={ids.excerpt}
                value={draft.excerpt[lang]}
                onChange={(event) => setText("excerpt", event.target.value)}
                rows={3}
                className={cn(fieldClass, "[field-sizing:content] resize-none")}
              />
              <p
                className={cn(
                  "mt-1 text-right text-xs tabular-nums",
                  draft.excerpt[lang].trim().length >= 80 ? "text-emerald-600" : "text-black/40",
                )}
              >
                {draft.excerpt[lang].trim().length}/80
              </p>
            </Field>
          </div>

          <div>
            <p className="text-sm font-medium">{editor.fields.body}</p>
            <p className="mt-0.5 mb-3 text-xs text-black/45">{editor.fields.bodyHint}</p>
            <BlockEditor
              blocks={draft.body[lang]}
              onChange={(blocks) => update({ body: { ...draft.body, [lang]: blocks } })}
              copy={editor.blocks}
            />
          </div>
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
              <ul className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  fill(editor.stats.words, { count: words }),
                  fill(editor.stats.readTime, { count: Math.max(1, Math.round(words / 200)) }),
                  fill(editor.stats.blocks, { count: draft.body[lang].length }),
                ].map((stat) => (
                  <li key={stat} className="rounded-xl bg-mist px-2 py-2.5 text-xs text-black/60">
                    {stat}
                  </li>
                ))}
              </ul>
            </section>
          </ReadinessPanel>
        </aside>
      </div>
    </div>
  );
}

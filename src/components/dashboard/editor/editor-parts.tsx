"use client";

import { CircleCheck, Circle, ImagePlus, PartyPopper, Rocket, Save, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { fill } from "@/components/dashboard/ui";
import type { SaveResult } from "@/app/actions/content";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Readiness } from "@/lib/dashboard/readiness";
import { cn } from "@/lib/utils";

type EditorCopy = Dictionary["dashboard"]["editor"];
export type EditLocale = "en" | "fr";

/** Shared input styles for the editors. */
export const fieldClass =
  "w-full rounded-xl bg-white px-3.5 py-2.5 text-sm text-ink ring-1 ring-black/10 outline-none transition-shadow placeholder:text-black/35 focus:ring-2 focus:ring-brand/40";

export function Field({
  label,
  hint,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {hint ? <p className="mt-0.5 text-xs text-black/45">{hint}</p> : null}
      <div className="mt-2">{children}</div>
    </div>
  );
}

/** EN / FR switch for the bilingual fields. */
export function LanguageTabs({
  value,
  onChange,
  copy,
  done,
}: {
  value: EditLocale;
  onChange: (value: EditLocale) => void;
  copy: EditorCopy;
  /** Whether each language already has its main text, shown as a dot. */
  done: Record<EditLocale, boolean>;
}) {
  return (
    <div
      role="tablist"
      aria-label={copy.language}
      className="inline-flex rounded-xl bg-white p-1 ring-1 ring-black/10"
    >
      {(["en", "fr"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          role="tab"
          aria-selected={value === lang}
          onClick={() => onChange(lang)}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            value === lang ? "bg-ink text-white" : "text-black/55 hover:text-ink",
          )}
        >
          {copy.languages[lang]}
          <span
            aria-hidden
            className={cn("size-1.5 rounded-full", done[lang] ? "bg-emerald-400" : "bg-black/20")}
          />
        </button>
      ))}
    </div>
  );
}

/** Progress ring with the percentage in the middle. */
export function ProgressRing({ percent, size = 88 }: { percent: number; size?: number }) {
  const stroke = size < 64 ? 5 : 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(10 10 10 / 0.07)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={percent === 100 ? "#10b981" : "var(--brand)"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percent / 100)}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span
        className={cn(
          "absolute inset-0 grid place-items-center font-heading font-semibold tabular-nums",
          size < 64 ? "text-xs" : "text-xl",
        )}
      >
        {percent}%
      </span>
    </div>
  );
}

/**
 * Publish readiness card: ring, encouraging status line, the checklist and the actions.
 * "Publish" stays disabled until every step is done.
 */
export function ReadinessPanel({
  readiness,
  copy,
  savedLabel,
  onSave,
  onPublish,
  published,
  children,
}: {
  readiness: Readiness;
  copy: EditorCopy;
  savedLabel: string;
  onSave: () => void;
  onPublish: () => void;
  published: boolean;
  children?: ReactNode;
}) {
  const left = readiness.checks.filter((check) => !check.done).length;
  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
        <h2 className="text-sm font-semibold">{copy.readiness.title}</h2>
        <div className="mt-4 flex items-center gap-4">
          <ProgressRing percent={readiness.percent} />
          <div>
            <p
              className={cn(
                "flex items-center gap-1.5 text-sm font-semibold",
                readiness.ready && "text-emerald-600",
              )}
            >
              {readiness.ready ? <PartyPopper aria-hidden className="size-4" /> : null}
              {readiness.ready ? copy.readiness.ready : fill(copy.readiness.left, { count: left })}
            </p>
            <p className="mt-1 text-xs text-black/45">{copy.publishHint}</p>
          </div>
        </div>
        <ul className="mt-5 space-y-2.5" aria-live="polite">
          {readiness.checks.map((check) => (
            <li key={check.key} className="flex items-start gap-2.5 text-sm">
              {check.done ? (
                <CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              ) : (
                <Circle aria-hidden className="mt-0.5 size-4 shrink-0 text-black/20" />
              )}
              <span className={check.done ? "text-black/45 line-through decoration-black/20" : ""}>
                {copy.checks[check.key as keyof EditorCopy["checks"]]}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-5 grid gap-2">
          <button
            type="button"
            onClick={onPublish}
            disabled={!readiness.ready || published}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:bg-black/10 disabled:text-black/40"
          >
            <Rocket aria-hidden className="size-4" />
            {copy.publish}
          </button>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium ring-1 ring-black/10 transition-colors hover:bg-mist"
          >
            <Save aria-hidden className="size-4" />
            {copy.saveDraft}
          </button>
          <p className="text-center text-xs text-black/45" aria-live="polite">
            {savedLabel}
          </p>
          {published ? (
            <p
              role="status"
              className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700"
            >
              {copy.published}
            </p>
          ) : null}
        </div>
      </section>
      {children}
    </div>
  );
}

/**
 * Slim readiness bar that stays at the top of the editor below the `xl` breakpoint, where
 * the full readiness panel sits under the form.
 */
export function CompactReadiness({
  readiness,
  copy,
  savedLabel,
  onSave,
  onPublish,
  published,
}: {
  readiness: Readiness;
  copy: EditorCopy;
  savedLabel: string;
  onSave: () => void;
  onPublish: () => void;
  published: boolean;
}) {
  const left = readiness.checks.filter((check) => !check.done).length;
  return (
    <div className="sticky top-[4.5rem] z-10 mb-5 flex items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-[0_8px_24px_-16px_rgb(10_10_10/0.35)] ring-1 ring-black/5 backdrop-blur xl:hidden">
      <ProgressRing percent={readiness.percent} size={48} />
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm font-semibold", readiness.ready && "text-emerald-600")}>
          {readiness.ready ? copy.readiness.ready : fill(copy.readiness.left, { count: left })}
        </p>
        <p className="truncate text-xs text-black/45" aria-live="polite">
          {savedLabel}
        </p>
      </div>
      <button
        type="button"
        onClick={onSave}
        aria-label={copy.saveDraft}
        title={copy.saveDraft}
        className="grid size-9 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-black/10 hover:bg-mist"
      >
        <Save aria-hidden className="size-4" />
      </button>
      <button
        type="button"
        onClick={onPublish}
        disabled={!readiness.ready || published}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-strong disabled:cursor-not-allowed disabled:bg-black/10 disabled:text-black/40"
      >
        <Rocket aria-hidden className="size-4" />
        <span className="hidden sm:inline">{copy.publish}</span>
      </button>
    </div>
  );
}

/** Reads a file as a data URL with its pixel size. */
export function readImage(file: File) {
  return new Promise<{ src: string; width: number; height: number }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const src = String(reader.result);
      const image = new window.Image();
      image.onload = () => resolve({ src, width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = reject;
      image.src = src;
    };
    reader.readAsDataURL(file);
  });
}

/** Cover picker with preview. Themed covers ("theme:…") show as "designed cover". */
export function CoverField({
  value,
  onChange,
  copy,
  aspect = "aspect-[21/9]",
  preview,
}: {
  value?: string;
  onChange: (value?: string) => void;
  copy: EditorCopy;
  aspect?: string;
  /** Rendering for themed covers. */
  preview?: ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  return (
    <Field label={copy.fields.cover} hint={copy.fields.coverHint} htmlFor={id}>
      <div
        className={cn("relative overflow-hidden rounded-2xl bg-mist ring-1 ring-black/5", aspect)}
      >
        {value && !value.startsWith("theme:") ? (
          <Image
            src={value}
            alt=""
            fill
            unoptimized={value.startsWith("data:")}
            sizes="720px"
            className="object-cover"
          />
        ) : value ? (
          preview
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-black/10 text-sm text-black/45 transition-colors hover:border-brand/40 hover:text-brand-strong"
          >
            <ImagePlus aria-hidden className="size-6" />
            {copy.fields.upload}
          </button>
        )}
        {value ? (
          <div className="absolute right-3 bottom-3 flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium shadow backdrop-blur hover:bg-white"
            >
              {copy.fields.replace}
            </button>
            <button
              type="button"
              onClick={() => onChange(undefined)}
              aria-label={copy.fields.remove}
              className="grid size-7 place-items-center rounded-lg bg-white/90 text-rose-600 shadow backdrop-blur hover:bg-white"
            >
              <Trash2 aria-hidden className="size-3.5" />
            </button>
          </div>
        ) : null}
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (file) onChange((await readImage(file)).src);
            event.target.value = "";
          }}
        />
      </div>
    </Field>
  );
}

/**
 * Draft saved in this browser (localStorage) until the database exists. Returns the saved
 * JSON (or null), a save function and the time of the last save.
 */
export function useLocalDraft(key: string) {
  const storageKey = `dashboard:${key}`;
  const subscribe = useCallback((notify: () => void) => {
    window.addEventListener("storage", notify);
    window.addEventListener("local-draft", notify);
    return () => {
      window.removeEventListener("storage", notify);
      window.removeEventListener("local-draft", notify);
    };
  }, []);
  const stored = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return window.localStorage.getItem(storageKey);
      } catch {
        return null;
      }
    },
    () => null,
  );
  const [error, setError] = useState(false);

  const save = useCallback(
    (value: unknown) => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify({ savedAt: Date.now(), value }));
        window.dispatchEvent(new Event("local-draft"));
        setError(false);
      } catch {
        // Quota exceeded (large images): the draft stays in memory only.
        setError(true);
      }
    },
    [storageKey],
  );

  const parsed = stored ? (JSON.parse(stored) as { savedAt: number; value: unknown }) : null;
  return { saved: parsed, save, error };
}

/**
 * Saves a draft to the database, one request at a time (changes made during a save are
 * sent right after it). A new record gets its id on the first save; `onCreated` receives
 * it so the page URL can follow.
 */
export function useServerSave<T>(
  initialId: string | null,
  action: (id: string | null, value: T) => Promise<SaveResult>,
  onCreated?: (id: string) => void,
) {
  const id = useRef(initialId);
  const busy = useRef(false);
  const queued = useRef<{ value: T } | null>(null);
  const [state, setState] = useState<{
    status: "idle" | "saving" | "saved" | "error";
    savedAt?: number;
  }>({
    status: "idle",
  });

  const save = useCallback(
    async (value: T) => {
      queued.current = { value };
      if (busy.current) return;
      busy.current = true;
      setState((current) => ({ ...current, status: "saving" }));
      while (queued.current) {
        const next = queued.current.value;
        queued.current = null;
        try {
          const result = await action(id.current, next);
          if (result.ok) {
            const created = id.current === null;
            id.current = result.id;
            setState({ status: "saved", savedAt: Date.parse(result.updatedAt) });
            if (created) onCreated?.(result.id);
          } else {
            setState((current) => ({ ...current, status: "error" }));
          }
        } catch {
          setState((current) => ({ ...current, status: "error" }));
        }
      }
      busy.current = false;
    },
    [action, onCreated],
  );

  return { save, ...state };
}

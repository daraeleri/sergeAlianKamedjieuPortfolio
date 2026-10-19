"use client";

import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Heading2,
  ImagePlus,
  List,
  Pilcrow,
  Quote,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import type { ArticleBlock } from "@/content/article-bodies";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";
import { readImage } from "./editor-parts";

type BlockCopy = Dictionary["dashboard"]["editor"]["blocks"];
type AddType = "p" | "h2" | "verse" | "quote" | "list" | "image";

const addButtons: { type: AddType; icon: LucideIcon }[] = [
  { type: "p", icon: Pilcrow },
  { type: "h2", icon: Heading2 },
  { type: "verse", icon: BookOpen },
  { type: "quote", icon: Quote },
  { type: "list", icon: List },
  { type: "image", icon: ImagePlus },
];

/** Heading anchor from its text, e.g. "A promise for all" -> "a-promise-for-all". */
function slugify(text: string) {
  return (
    text
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "section"
  );
}

function emptyBlock(type: Exclude<AddType, "image">): ArticleBlock {
  switch (type) {
    case "p":
      return { type: "p", text: "" };
    case "h2":
      return { type: "h2", id: "section", text: "" };
    case "verse":
      return { type: "verse", text: "", reference: "" };
    case "quote":
      return { type: "quote", text: "" };
    case "list":
      return { type: "list", items: [] };
  }
}

const textareaClass =
  "w-full resize-none bg-transparent outline-none [field-sizing:content] placeholder:text-black/30";

/**
 * Medium-style block editor: the article is a list of blocks (paragraph, heading, Bible
 * verse, quote, list, image) that can be written in place, reordered and removed. Images
 * are uploaded from the device and kept in the draft.
 */
export function BlockEditor({
  blocks,
  onChange,
  copy,
}: {
  blocks: ArticleBlock[];
  onChange: (blocks: ArticleBlock[]) => void;
  copy: BlockCopy;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (index: number, block: ArticleBlock) =>
    onChange(blocks.map((current, i) => (i === index ? block : current)));
  const move = (index: number, delta: number) => {
    const next = [...blocks];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  };
  const remove = (index: number) => onChange(blocks.filter((_, i) => i !== index));

  return (
    <div>
      <ol className="space-y-3">
        {blocks.map((block, index) => (
          <li
            key={index}
            className="group relative rounded-2xl bg-white px-5 py-4 ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-brand/30"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-[0.7rem] font-semibold tracking-[0.1em] text-black/35 uppercase">
                {copy[block.type === "h3" ? "h2" : block.type]}
              </span>
              <div className="flex gap-1 opacity-60 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                <IconButton
                  label={copy.moveUp}
                  icon={ArrowUp}
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                />
                <IconButton
                  label={copy.moveDown}
                  icon={ArrowDown}
                  disabled={index === blocks.length - 1}
                  onClick={() => move(index, 1)}
                />
                <IconButton
                  label={copy.remove}
                  icon={Trash2}
                  danger
                  onClick={() => remove(index)}
                />
              </div>
            </div>
            <BlockFields block={block} copy={copy} onChange={(next) => update(index, next)} />
          </li>
        ))}
      </ol>

      {/* Add block */}
      <div className="mt-3 rounded-2xl border-2 border-dashed border-black/10 p-3">
        <p className="px-1 pb-2 text-xs font-medium text-black/45">{copy.add}</p>
        <div className="flex flex-wrap gap-2">
          {addButtons.map(({ type, icon: Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                type === "image"
                  ? fileRef.current?.click()
                  : onChange([...blocks, emptyBlock(type)])
              }
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium ring-1 ring-black/10 transition-colors hover:bg-brand-tint hover:text-brand-strong"
            >
              <Icon aria-hidden className="size-4" />
              {copy[type]}
            </button>
          ))}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            const image = await readImage(file);
            onChange([...blocks, { type: "image", ...image, alt: "", caption: "" }]);
          }}
        />
      </div>
    </div>
  );
}

function BlockFields({
  block,
  copy,
  onChange,
}: {
  block: ArticleBlock;
  copy: BlockCopy;
  onChange: (block: ArticleBlock) => void;
}) {
  switch (block.type) {
    case "p":
      return (
        <textarea
          aria-label={copy.p}
          value={block.text}
          onChange={(event) => onChange({ ...block, text: event.target.value })}
          placeholder={copy.textPlaceholder}
          rows={2}
          className={cn(textareaClass, "text-[1.02rem] leading-relaxed")}
        />
      );
    case "h2":
    case "h3":
      return (
        <input
          aria-label={copy.h2}
          value={block.text}
          onChange={(event) =>
            onChange({ type: "h2", id: slugify(event.target.value), text: event.target.value })
          }
          placeholder={copy.headingPlaceholder}
          className="w-full bg-transparent font-heading text-xl font-semibold tracking-tight outline-none placeholder:text-black/30"
        />
      );
    case "verse":
      return (
        <div className="rounded-xl bg-brand-tint p-4">
          <textarea
            aria-label={copy.verse}
            value={block.text}
            onChange={(event) => onChange({ ...block, text: event.target.value })}
            placeholder={copy.versePlaceholder}
            rows={2}
            className={cn(textareaClass, "font-heading text-lg")}
          />
          <input
            aria-label={copy.reference}
            value={block.reference}
            onChange={(event) => onChange({ ...block, reference: event.target.value })}
            placeholder={copy.reference}
            className="mt-2 w-full bg-transparent text-sm font-semibold text-brand-strong outline-none placeholder:text-brand-strong/40"
          />
        </div>
      );
    case "quote":
      return (
        <div className="border-l-4 border-brand pl-4">
          <textarea
            aria-label={copy.quote}
            value={block.text}
            onChange={(event) => onChange({ ...block, text: event.target.value })}
            placeholder={copy.quotePlaceholder}
            rows={1}
            className={cn(textareaClass, "font-heading text-xl font-medium")}
          />
          <input
            aria-label={copy.cite}
            value={block.cite ?? ""}
            onChange={(event) => onChange({ ...block, cite: event.target.value || undefined })}
            placeholder={copy.cite}
            className="mt-1 w-full bg-transparent text-sm text-black/55 outline-none placeholder:text-black/30"
          />
        </div>
      );
    case "list":
      return (
        <textarea
          aria-label={copy.list}
          value={block.items.join("\n")}
          onChange={(event) => onChange({ ...block, items: event.target.value.split("\n") })}
          placeholder={copy.listPlaceholder}
          rows={3}
          className={cn(textareaClass, "leading-relaxed")}
        />
      );
    case "image":
      return (
        <div>
          <div className="flex justify-center rounded-xl bg-mist p-4">
            <Image
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
              unoptimized={block.src.startsWith("data:")}
              sizes="640px"
              className="h-auto max-h-72 w-auto max-w-full rounded-lg"
            />
          </div>
          <input
            aria-label={copy.alt}
            value={block.alt}
            onChange={(event) => onChange({ ...block, alt: event.target.value })}
            placeholder={copy.alt}
            className="mt-3 w-full rounded-lg bg-mist px-3 py-2 text-sm outline-none placeholder:text-black/35 focus:ring-2 focus:ring-brand/30"
          />
          <input
            aria-label={copy.caption}
            value={block.caption ?? ""}
            onChange={(event) => onChange({ ...block, caption: event.target.value })}
            placeholder={copy.caption}
            className="mt-2 w-full bg-transparent text-center text-sm text-black/55 outline-none placeholder:text-black/30"
          />
        </div>
      );
  }
}

function IconButton({
  label,
  icon: Icon,
  onClick,
  disabled,
  danger,
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-7 place-items-center rounded-lg text-black/50 transition-colors hover:bg-mist disabled:opacity-30",
        danger && "hover:bg-rose-50 hover:text-rose-600",
      )}
    >
      <Icon aria-hidden className="size-3.5" />
    </button>
  );
}

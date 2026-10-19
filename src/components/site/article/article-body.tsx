import { BookOpen } from "lucide-react";
import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import type { ArticleBlock } from "@/content/article-bodies";
import { cn } from "@/lib/utils";

/** Renders **bold** and *italic* inside a block of text. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/**
 * Article body (Medium-style reading column): paragraphs with a drop cap on the first one,
 * section headings, highlighted Bible verses, pull quotes, lists and images with captions.
 * Text blocks stay at a comfortable reading width; wide images use the full column.
 */
export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  const firstParagraph = blocks.findIndex((block) => block.type === "p");

  return (
    <div className="text-[1.0625rem] leading-[1.85] text-black/75 sm:text-[1.125rem] [&>*]:max-w-[42rem]">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p
                key={i}
                className={cn(
                  "mt-6 first:mt-0",
                  i === firstParagraph &&
                    "first-letter:float-left first-letter:mt-1.5 first-letter:mr-3 first-letter:font-heading first-letter:text-[4.1rem] first-letter:leading-[0.8] first-letter:font-semibold first-letter:text-brand",
                )}
              >
                {inline(block.text)}
              </p>
            );
          case "h2":
            return (
              <h2
                key={i}
                id={block.id}
                className="mt-14 scroll-mt-28 font-heading text-2xl leading-tight font-semibold tracking-tight text-ink sm:text-[1.8rem]"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={i}
                className="mt-10 font-heading text-xl leading-snug font-semibold tracking-tight text-ink"
              >
                {block.text}
              </h3>
            );
          case "verse":
            return (
              <figure
                key={i}
                className="relative isolate mt-10 overflow-hidden rounded-2xl bg-brand-tint px-6 py-7 ring-1 ring-brand/10 sm:px-8"
              >
                <BookOpen
                  aria-hidden
                  strokeWidth={1.25}
                  className="absolute -right-3 -bottom-4 -z-10 size-28 text-brand/10"
                />
                <blockquote className="font-heading text-lg leading-relaxed font-medium text-ink sm:text-xl">
                  {block.text}
                </blockquote>
                <figcaption className="mt-4 text-sm font-semibold tracking-wide text-brand-strong">
                  {block.reference}
                </figcaption>
              </figure>
            );
          case "quote":
            return (
              <figure key={i} className="my-12 border-l-4 border-brand pl-6 sm:pl-8">
                <blockquote className="font-heading text-2xl leading-snug font-medium tracking-tight text-balance text-ink sm:text-[1.9rem]">
                  {block.text}
                </blockquote>
                {block.cite ? (
                  <figcaption className="mt-4 text-sm font-medium text-black/50">
                    {block.cite}
                  </figcaption>
                ) : null}
              </figure>
            );
          case "list": {
            const List = block.ordered ? "ol" : "ul";
            return (
              <List key={i} className="mt-6 space-y-3">
                {block.items.map((item, n) => (
                  <li key={n} className="flex gap-3.5">
                    {block.ordered ? (
                      <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-brand-tint text-xs font-semibold text-brand-strong tabular-nums">
                        {n + 1}
                      </span>
                    ) : (
                      <span
                        aria-hidden
                        className="mt-[0.8em] size-1.5 shrink-0 rounded-full bg-brand"
                      />
                    )}
                    <span>{inline(item)}</span>
                  </li>
                ))}
              </List>
            );
          }
          case "image":
            return (
              <figure key={i} className={cn("mt-10 mb-2", block.wide && "!max-w-none")}>
                {block.framed ? (
                  <div className="flex justify-center rounded-2xl bg-mist px-6 py-8 sm:px-10 sm:py-10">
                    <Image
                      src={block.src}
                      alt={block.alt}
                      width={block.width}
                      height={block.height}
                      sizes={
                        block.wide
                          ? "(min-width: 1024px) 760px, 92vw"
                          : "(min-width: 768px) 640px, 92vw"
                      }
                      className={cn(
                        "h-auto w-auto max-w-full",
                        block.wide ? "max-h-[28rem]" : "max-h-[24rem]",
                        block.height > block.width &&
                          "drop-shadow-[0_20px_30px_rgb(10_10_10/0.18)]",
                      )}
                    />
                  </div>
                ) : (
                  <Image
                    src={block.src}
                    alt={block.alt}
                    width={block.width}
                    height={block.height}
                    sizes={
                      block.wide
                        ? "(min-width: 1024px) 760px, 92vw"
                        : "(min-width: 768px) 672px, 92vw"
                    }
                    className="h-auto w-full rounded-2xl"
                  />
                )}
                {block.caption ? (
                  <figcaption className="mt-3 text-center text-sm leading-relaxed text-black/50">
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
        }
      })}
    </div>
  );
}

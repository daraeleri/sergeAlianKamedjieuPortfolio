"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TocItem = { id: string; text: string };

/**
 * Table of contents built from the article's section headings. The section being read is
 * highlighted. "sidebar" is the sticky desktop list; "collapsible" is a disclosure for
 * phones and tablets, shown above the article.
 */
export function ArticleToc({
  items,
  label,
  variant,
}: {
  items: TocItem[];
  label: string;
  variant: "sidebar" | "collapsible";
}) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!headings.length) return;

    // The active section is the last heading that has passed the top quarter of the screen.
    const update = () => {
      const line = window.innerHeight * 0.25;
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) current = heading.id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  if (!items.length) return null;

  const list = (
    <ol className="space-y-1 border-l border-black/10">
      {items.map((item) => {
        const current = item.id === active;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={current ? "location" : undefined}
              className={cn(
                "-ml-px block border-l-2 py-1.5 pl-4 text-sm leading-snug transition-colors",
                current
                  ? "border-brand font-medium text-brand-strong"
                  : "border-transparent text-black/55 hover:text-ink",
              )}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ol>
  );

  if (variant === "collapsible") {
    return (
      <details className="group mb-10 rounded-2xl bg-mist px-5 py-4 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold [&::-webkit-details-marker]:hidden">
          {label}
          <ChevronDown
            aria-hidden
            className="size-4 transition-transform duration-300 group-open:rotate-180"
          />
        </summary>
        <nav aria-label={label} className="mt-4">
          {list}
        </nav>
      </details>
    );
  }

  return (
    <nav aria-label={label}>
      <p className="text-xs font-semibold tracking-[0.14em] text-black/45 uppercase">{label}</p>
      <div className="mt-4">{list}</div>
    </nav>
  );
}

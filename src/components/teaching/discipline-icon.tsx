import type { ReactNode } from "react";
import type { DisciplineIcon as IconName } from "@/content/teaching";

const paths: Record<IconName, ReactNode> = {
  // Open book with a cross: doctrine
  doctrine: (
    <>
      <path d="M8 14c8-3 16-3 24 2v34c-8-5-16-5-24-2V14Z" />
      <path d="M56 14c-8-3-16-3-24 2v34c8-5 16-5 24-2V14Z" />
      <path d="M44 22v14M38 27h12" />
    </>
  ),
  // Scroll: Scripture
  scripture: (
    <>
      <path d="M16 12h30a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6h-4" />
      <path d="M22 12a6 6 0 0 0-6 6v28a6 6 0 0 0 6 6h26a6 6 0 0 0 6-6V24" />
      <path d="M24 30h20M24 37h20M24 44h12" />
    </>
  ),
  // Shepherd's crook: pastoral care
  pastoral: (
    <>
      <path d="M30 56V22a10 10 0 1 1 20 0v2" />
      <path d="M18 56h24" />
      <circle cx="50" cy="28" r="2.5" />
    </>
  ),
  // Scales: ethics
  ethics: (
    <>
      <path d="M32 10v44M20 54h24M14 18h36" />
      <path d="M14 18 7 34h14l-7-16ZM50 18l-7 16h14l-7-16Z" />
      <path d="M7 34a7 5 0 0 0 14 0M43 34a7 5 0 0 0 14 0" />
    </>
  ),
  // Columns under a pediment: history
  history: (
    <>
      <path d="M8 24 32 10l24 14H8Z" />
      <path d="M14 30v18M26 30v18M38 30v18M50 30v18" />
      <path d="M8 54h48M10 48h44" />
    </>
  ),
};

export function DisciplineIcon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

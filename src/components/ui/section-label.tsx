import { cn } from "@/lib/utils";

type SectionLabelProps = {
  label: string;
  /** Section number shown on the right, e.g. "02". */
  index: string;
  tone?: "light" | "dark";
  className?: string;
};

/** Hairline row with a "◆ LABEL" on the left and a section number on the right (Fluid Glass style). */
export function SectionLabel({ label, index, tone = "light", className }: SectionLabelProps) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "flex items-center justify-between border-t pt-4 font-mono text-xs tracking-[0.16em] uppercase",
        dark ? "border-white/15 text-white/60" : "border-black/10 text-black/60",
        className,
      )}
    >
      <span className="flex items-center gap-2">
        <span aria-hidden className={dark ? "text-brand-soft" : "text-brand"}>
          ◆
        </span>
        {label}
      </span>
      <span aria-hidden>({index})</span>
    </div>
  );
}

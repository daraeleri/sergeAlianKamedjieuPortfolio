import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/routing";

type HeroProps = {
  locale: Locale;
  copy: Dictionary["hero"];
};

/** Full-bleed home hero: oversized heading, blue swoosh and portrait cut-out. */
export function Hero({ locale, copy }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-tint text-ink">
      <Swoosh />
      {/* Soft blue glow behind the portrait */}
      <div
        aria-hidden
        className="absolute -right-40 bottom-0 -z-10 size-[42rem] rounded-full bg-brand/20 blur-3xl"
      />

      <div className="mx-auto grid min-h-svh max-w-7xl items-end gap-6 px-5 pt-28 sm:px-8 md:grid-cols-2 md:gap-0 lg:grid-cols-[1.1fr_1fr] lg:pt-32">
        <div className="pb-4 md:self-center md:pb-24">
          <p className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-medium tracking-wide text-black/70 shadow-sm sm:text-sm">
            <span aria-hidden className="size-1.5 rounded-full bg-brand" />
            {copy.eyebrow}
          </p>

          <h1 className="mt-6 max-w-[14ch] animate-fade-up font-heading text-[2.15rem] leading-[1.05] font-bold tracking-tight text-balance [animation-delay:120ms] sm:text-5xl md:text-[2.75rem] lg:text-[3.5rem] xl:text-[4rem]">
            {copy.titleLead}{" "}
            <span className="relative inline-block text-brand">
              {copy.titleHighlight}
              {/* Hand-drawn style underline under the highlighted phrase */}
              <svg
                aria-hidden
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-2.5 w-full text-brand/35"
              >
                <path
                  d="M2 9 C 80 3 200 2 298 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-6 max-w-lg animate-fade-up text-base leading-relaxed text-black/65 [animation-delay:240ms] sm:text-lg">
            {copy.description}
          </p>

          <div className="mt-8 flex animate-fade-up flex-wrap items-center gap-x-6 gap-y-4 [animation-delay:360ms]">
            <Link
              href={localizePath(locale, "/sermons")}
              className="rounded-xl bg-brand px-6 py-3.5 font-medium text-white shadow-[0_10px_30px_-10px] shadow-brand transition-colors hover:bg-brand-strong"
            >
              {copy.primaryCta}
            </Link>
            <Link
              href={localizePath(locale, "/contact")}
              className="group inline-flex items-center gap-2 font-medium text-ink underline decoration-brand decoration-2 underline-offset-8 hover:decoration-ink"
            >
              {copy.secondaryCta}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md self-end sm:max-w-lg md:max-w-none">
          <Image
            src="/images/PersonaImage.png"
            alt={copy.portraitAlt}
            width={1122}
            height={1044}
            preload
            sizes="(min-width: 1280px) 600px, (min-width: 768px) 48vw, (min-width: 640px) 512px, 92vw"
            className="relative z-10 h-auto w-full max-w-none animate-fade-up drop-shadow-[0_20px_40px_rgb(0_0_0/0.18)] [animation-delay:200ms] md:-ml-[10%] md:w-[125%] lg:ml-0 lg:w-full"
          />

          {/* <Link
            href={localizePath(locale, "/sermons")}
            className="group absolute bottom-[14%] left-0 z-20 w-40 -rotate-6 animate-fade-up rounded-2xl bg-brand p-4 shadow-xl transition-transform [animation-delay:600ms] hover:-rotate-3 sm:w-48 sm:p-5 lg:top-[18%] lg:bottom-auto lg:-left-6"
          >
            <span className="text-xs font-medium tracking-wide text-white/75 uppercase">
              {copy.cardLabel}
            </span>
            <span className="mt-1 flex items-end justify-between gap-2 font-heading text-xl leading-tight font-bold sm:text-2xl">
              {copy.cardTitle}
              <span
                aria-hidden
                className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-sm text-brand transition-transform group-hover:translate-x-0.5"
              >
                ▶
              </span>
            </span>
          </Link> */}
        </div>
      </div>
    </section>
  );
}

/**
 * Thick royal-blue ribbon that loops behind the portrait, drawn in on load.
 * On phones it is confined to the lower half so it never sits under the text.
 */
function Swoosh() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-x-0 bottom-0 -z-10 h-1/2 w-full md:inset-y-0 md:h-full"
    >
      <path
        d="M-120 930 C 220 900 460 860 640 740 C 820 620 780 400 980 370 C 1180 340 1200 580 1030 610 C 860 640 880 420 1100 310 C 1280 220 1400 190 1560 150"
        fill="none"
        stroke="var(--brand)"
        strokeWidth="110"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        className="animate-draw opacity-90"
      />
    </svg>
  );
}

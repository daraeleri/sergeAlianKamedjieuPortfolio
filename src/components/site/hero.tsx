import { ArrowRight, BadgeCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { sectionHref } from "@/i18n/routing";
import { currentYear } from "@/lib/current-year";

type HeroProps = {
  locale: Locale;
  copy: Dictionary["hero"];
};

/**
 * Home hero (golden-gab layout, BeeToGreen colour, LogoMint scale): a centred eyebrow,
 * heading, subtitle, two buttons and a proof line, above a rounded royal-blue stage that
 * the portrait rises out of. Handwritten notes with drawn arrows point at the portrait,
 * and two glass chips on the stage carry the key figures. CSS-only motion, so the
 * portrait (the LCP image) is never held back by JavaScript.
 */
export async function Hero({ locale, copy }: HeroProps) {
  const years = (await currentYear()) - profile.callingYear;

  return (
    <section className="relative isolate overflow-hidden bg-white text-ink">
      {/* Faint grid and glow behind the heading */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[linear-gradient(to_right,rgb(65_105_225/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(65_105_225/0.06)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)] bg-[size:3.5rem_3.5rem]"
      />
      <div
        aria-hidden
        className="absolute top-24 left-1/2 -z-10 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-brand-soft/20 blur-3xl"
      />

      <div className="mx-auto max-w-6xl px-3 pt-32 pb-3 sm:px-8 sm:pt-36 sm:pb-4">
        {/* Intro */}
        <div className="mx-auto max-w-3xl px-2 text-center">
          <p className="inline-flex animate-fade-up items-center gap-2 rounded-full bg-mist px-3.5 py-1.5 text-xs font-medium text-black/65 ring-1 ring-black/5">
            <BadgeCheck aria-hidden strokeWidth={2} className="size-3.5 text-brand" />
            {copy.eyebrow}
          </p>

          <h1 className="mt-6 animate-fade-up font-heading text-[2.3rem] leading-[1.05] font-semibold tracking-tight text-balance [animation-delay:100ms] sm:text-5xl lg:text-[4rem]">
            {copy.titleLead}{" "}
            <span className="relative inline-block text-brand">
              {copy.titleHighlight}
              <svg
                aria-hidden
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-2.5 w-full text-brand/30"
              >
                <path
                  d="M2 9 C 80 3 200 2 298 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1"
                  className="animate-draw [animation-delay:600ms]"
                />
              </svg>
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl animate-fade-up leading-relaxed text-black/60 [animation-delay:200ms] sm:text-lg">
            {copy.description}
          </p>

          <div className="mt-8 flex animate-fade-up flex-wrap items-center justify-center gap-3 [animation-delay:300ms]">
            <Link
              href={sectionHref(locale, "about")}
              className="group inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white shadow-[0_10px_24px_-12px] shadow-brand transition-colors hover:bg-brand-strong"
            >
              {copy.primaryCta}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href={sectionHref(locale, "contact")}
              className="inline-flex items-center rounded-xl bg-mist px-5 py-3 text-sm font-medium text-ink ring-1 ring-black/5 transition-colors hover:bg-brand-tint hover:text-brand-strong"
            >
              {copy.secondaryCta}
            </Link>
          </div>

          <p className="mt-5 animate-fade-up text-xs text-black/45 [animation-delay:400ms] sm:text-sm">
            {copy.proof}
          </p>
        </div>

        {/* Stage */}
        <div className="relative mt-28 h-[13.5rem] animate-fade-up [animation-delay:250ms] sm:mt-36 sm:h-[21rem] lg:mt-40 lg:h-[23rem]">
          {/* Background layer, clipped on its own so the portrait can rise out of the top */}
          <div
            aria-hidden
            className="absolute inset-0 overflow-hidden rounded-[2rem] bg-brand sm:rounded-[2.5rem]"
          >
            <svg
              viewBox="0 0 1200 400"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 size-full"
            >
              <path
                d="M-60 330 C 200 300 330 120 520 150 C 700 180 620 360 470 320 C 330 280 470 60 760 70 C 960 78 1080 200 1260 120"
                fill="none"
                stroke="var(--brand-soft)"
                strokeWidth="56"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                className="animate-draw opacity-45 [animation-delay:500ms] [animation-duration:2.2s]"
              />
            </svg>
            <div className="absolute -bottom-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-white/20 blur-3xl" />
          </div>

          {/* Portrait */}
          <div className="absolute bottom-0 left-1/2 z-10 w-[19rem] -translate-x-1/2 sm:w-[28rem] lg:w-[33rem]">
            <Image
              src="/images/PersonaImage.png"
              alt={copy.portraitAlt}
              width={1122}
              height={1044}
              preload
              sizes="(min-width: 1024px) 528px, (min-width: 640px) 448px, 304px"
              className="h-auto w-full animate-fade-up drop-shadow-[0_24px_40px_rgb(10_10_10/0.25)] [animation-delay:350ms]"
            />
          </div>

          {/* Handwritten notes (desktop) */}
          <Note
            text={copy.noteLeft}
            className="absolute -top-20 right-[calc(50%+11rem)] hidden text-right md:block lg:right-[calc(50%+13rem)]"
            arrow="left"
          />
          <Note
            text={copy.noteRight}
            className="absolute -top-14 left-[calc(50%+12rem)] hidden md:block lg:left-[calc(50%+14rem)]"
            arrow="right"
          />

          {/* Key figures on the stage */}
          <dl className="absolute bottom-5 left-5 z-20 hidden rounded-2xl bg-white/12 px-4 py-3 text-white ring-1 ring-white/25 backdrop-blur-md sm:block lg:bottom-8 lg:left-8">
            <dt className="sr-only">{copy.statYears}</dt>
            <dd className="font-heading text-3xl leading-none font-semibold">{years}+</dd>
            <dd className="mt-1 text-xs text-white/80">{copy.statYears}</dd>
          </dl>
          <dl className="absolute right-5 bottom-5 z-20 hidden gap-5 rounded-2xl bg-white/12 px-4 py-3 text-white ring-1 ring-white/25 backdrop-blur-md sm:flex lg:right-8 lg:bottom-8">
            <div>
              <dt className="sr-only">{copy.statDoctorates}</dt>
              <dd className="font-heading text-3xl leading-none font-semibold">
                {profile.doctorates}
              </dd>
              <dd className="mt-1 text-xs text-white/80">{copy.statDoctorates}</dd>
            </div>
            <div className="border-l border-white/25 pl-5">
              <dt className="sr-only">{copy.statBooks}</dt>
              <dd className="font-heading text-3xl leading-none font-semibold">{profile.books}</dd>
              <dd className="mt-1 text-xs text-white/80">{copy.statBooks}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

/** Handwritten note with a drawn arrow curling towards the portrait. */
function Note({
  text,
  arrow,
  className,
}: {
  text: string;
  arrow: "left" | "right";
  className?: string;
}) {
  const left = arrow === "left";
  return (
    <div aria-hidden className={className}>
      <p className="animate-fade-up font-hand text-2xl leading-none font-semibold whitespace-nowrap text-black/70 [animation-delay:900ms] lg:text-[1.7rem]">
        {text}
      </p>
      <svg
        viewBox="0 0 90 60"
        className={left ? "mt-1 ml-auto h-14 w-20" : "mt-1 h-14 w-20 -scale-x-100"}
      >
        <path
          d="M8 6 C 30 4 58 14 62 34 C 64 44 56 50 48 44 C 40 38 52 26 70 34 C 78 38 82 46 84 54"
          fill="none"
          stroke="var(--ink)"
          strokeOpacity="0.55"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          className="animate-draw [animation-delay:1100ms]"
        />
        <path
          d="M76 50 L84 55 L86 46"
          fill="none"
          stroke="var(--ink)"
          strokeOpacity="0.55"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-fade-up [animation-delay:1900ms]"
        />
      </svg>
    </div>
  );
}

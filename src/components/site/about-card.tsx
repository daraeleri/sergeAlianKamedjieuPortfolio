"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  HandHeart,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type AboutCardProps = {
  copy: Dictionary["about"];
  /** Primary button target, e.g. the Academic background section. */
  primaryHref: Route;
  contactHref: Route;
};

/** Icon for each feature, in the order of `about.features` in the dictionaries. */
const featureIcons: LucideIcon[] = [GraduationCap, Megaphone, BookOpen, HandHeart];

/**
 * Navy introduction card under the About statement: greeting, short bio, a 2×2 grid
 * of icon features and CTAs, with the portrait breaking out of the top on desktop.
 * On scroll the background opens up, the portrait rises and the features fade in.
 */
export function AboutCard({ copy, primaryHref, contactHref }: AboutCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const opening = {
        trigger: rootRef.current,
        start: "top 90%",
        end: "top 40%",
        scrub: true,
      };

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-about-bg]",
          { clipPath: "inset(8% 5% 8% 5% round 3rem)" },
          { clipPath: "inset(0% 0% 0% 0% round 2.5rem)", ease: "none", scrollTrigger: opening },
        );
        gsap.fromTo(
          "[data-about-portrait]",
          { yPercent: 18, scale: 0.94 },
          {
            yPercent: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 85%",
              end: "top 30%",
              scrub: 1,
            },
          },
        );
        gsap.to("[data-about-blob]", {
          yPercent: (i: number) => (i ? -18 : 14),
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
        // Text and features fade in, and fade back out when scrolling up past the card.
        gsap.from("[data-about-reveal]", {
          y: 36,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Desktop: the photo frame closes in step with the card background (same inset,
      // converted to the frame's own size: 42% of the card wide, 112% of it tall), so the
      // photo never sticks out of the shrinking card.
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-about-portrait-frame]",
          { clipPath: "inset(-60% 11.9% 7.1% 0% round 0 0 3rem 0)" },
          {
            clipPath: "inset(-60% 0% 0% 0% round 0 0 2.5rem 0)",
            ease: "none",
            scrollTrigger: opening,
          },
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="relative mt-20 sm:mt-28 lg:mt-48">
      {/* Background layer: clipped separately so the portrait can break out of the top. */}
      <div
        data-about-bg
        aria-hidden
        className="absolute inset-0 overflow-hidden rounded-[2rem] bg-[#13224d] sm:rounded-[2.5rem]"
      >
        <svg
          data-about-blob
          viewBox="0 0 600 500"
          className="absolute -top-24 -left-24 w-[70%] min-w-[26rem] text-[#0c1636]"
        >
          <path
            fill="currentColor"
            d="M0 0h560c-30 120-120 170-210 230-110 70-150 190-350 230V0Z"
          />
        </svg>
        <svg
          data-about-blob
          viewBox="0 0 600 500"
          className="absolute -right-20 -bottom-28 w-[65%] min-w-[24rem] text-brand/35"
        >
          <path
            fill="currentColor"
            d="M600 500H40c40-110 130-150 230-190 120-50 190-150 330-210v400Z"
          />
        </svg>
      </div>

      <div className="relative grid text-white lg:grid-cols-[1.4fr_1fr]">
        <div className="px-6 pt-10 pb-4 sm:px-12 sm:pt-14 lg:py-16 lg:pr-4 lg:pl-14">
          <h3
            data-about-reveal
            className="font-heading text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
          >
            {copy.greetingLead} <span className="text-brand-soft">{copy.greetingHighlight}</span>
          </h3>
          <p
            data-about-reveal
            className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
          >
            {copy.bio}
          </p>

          <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {copy.features.map((feature, i) => (
              <li key={feature.title} data-about-reveal className="flex gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#0a1430] text-brand-soft ring-1 ring-white/10">
                  <FeatureIcon icon={featureIcons[i]} />
                </span>
                <div>
                  <p className="font-heading text-lg font-semibold tracking-tight sm:text-xl">
                    {feature.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-white/65">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div data-about-reveal className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href={primaryHref}
              className="group inline-flex items-center gap-3 rounded-xl bg-brand px-6 py-3.5 font-medium text-white shadow-[0_10px_30px_-10px] shadow-brand transition-colors hover:bg-brand-strong"
            >
              {copy.cta}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href={contactHref}
              className="font-medium text-white underline decoration-brand-soft decoration-2 underline-offset-8 hover:decoration-white"
            >
              {copy.secondaryCta}
            </Link>
          </div>
        </div>

        {/*
          Portrait: in the flow on small screens. On desktop it is taller than the card so
          the head breaks out of the top. The frame is clipped to the card's bottom and
          right edges (with the same rounded corner), so the photo never sticks out of the
          card; its left edge fades out so the arm never covers the text.
        */}
        <div className="relative flex items-end justify-center overflow-hidden px-6 lg:static lg:overflow-visible lg:px-0">
          <div
            data-about-portrait-frame
            className="relative aspect-[1122/1044] w-full max-w-xs sm:max-w-sm lg:absolute lg:right-0 lg:bottom-0 lg:aspect-auto lg:h-[112%] lg:w-[42%] lg:max-w-none lg:[mask-image:linear-gradient(to_right,transparent,black_22%)] lg:[clip-path:inset(-60%_0%_0%_0%_round_0_0_2.5rem_0)]"
          >
            <div data-about-portrait className="relative size-full origin-bottom">
              <Image
                src="/images/PersonaImage.png"
                alt={copy.portraitAlt}
                fill
                quality={90}
                sizes="(min-width: 1024px) 840px, (min-width: 640px) 384px, 80vw"
                className="object-cover object-[60%_0%]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureIcon({ icon: Icon = BookOpen }: { icon?: LucideIcon }) {
  return <Icon aria-hidden strokeWidth={1.75} className="size-6" />;
}

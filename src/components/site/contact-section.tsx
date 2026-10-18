"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Mail, MapPin } from "lucide-react";
import { useRef } from "react";
import { ContactForm } from "@/components/site/contact-form";
import type { Dictionary } from "@/i18n/get-dictionary";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type ContactSectionProps = {
  copy: Dictionary["contact"];
  email: string;
  location: string;
};

/**
 * "Contact / Invitation" section in the BeeToGreen style: a bold royal-blue rounded panel
 * with the invitation pitch, request topics and contact details on the left, and a white
 * form card on the right.
 */
export function ContactSection({ copy, email, location }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const reverse = "play none none reverse";
        const split = SplitText.create("[data-contact-heading]", { type: "lines", mask: "lines" });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: "[data-contact-heading]",
            start: "top 85%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-contact-reveal]", {
          y: 30,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-contact-heading]",
            start: "top 75%",
            toggleActions: reverse,
          },
        });
        gsap.from("[data-contact-card]", {
          y: 90,
          opacity: 0,
          scale: 0.95,
          duration: 1,
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: "[data-contact-card]",
            start: "top 90%",
            toggleActions: reverse,
          },
        });
        return () => split.revert();
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="contact" className="bg-white px-2 pb-2 sm:px-4 sm:pb-4">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-brand py-20 text-white sm:rounded-[3rem] sm:py-28 lg:py-32">
        {/* Decorative swooshes and glow */}
        <svg
          aria-hidden
          viewBox="0 0 400 400"
          className="absolute -top-24 -left-28 -z-10 size-[30rem] text-white/[0.08]"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="46"
            strokeLinecap="round"
            d="M40 330C80 220 170 250 210 170s-30-130 40-130 120 90 70 170"
          />
        </svg>
        <div
          aria-hidden
          className="absolute -right-40 -bottom-40 -z-10 size-[36rem] rounded-full bg-brand-soft/40 blur-3xl"
        />

        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Pitch and details */}
          <div className="lg:pt-6">
            <p
              data-contact-reveal
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white sm:text-sm"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-white" />
              {copy.label}
            </p>
            <h2
              data-contact-heading
              className="mt-6 font-heading text-[2.4rem] leading-[1.02] font-bold tracking-tight text-balance sm:text-6xl"
            >
              {copy.headingLead} <span className="text-ink">{copy.headingHighlight}</span>
            </h2>
            <p
              data-contact-reveal
              className="mt-6 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg"
            >
              {copy.intro}
            </p>

            <div data-contact-reveal className="mt-8">
              <p className="text-sm font-medium text-white/70">{copy.reasonsLabel}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {copy.reasons.map((reason) => (
                  <li
                    key={reason}
                    className="rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-medium ring-1 ring-white/20"
                  >
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            <dl data-contact-reveal className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-brand">
                  <MapPin aria-hidden strokeWidth={1.75} className="size-5" />
                </span>
                <div>
                  <dt className="text-xs text-white/70">{copy.locationLabel}</dt>
                  <dd className="font-medium">{location}</dd>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-brand">
                  <Mail aria-hidden strokeWidth={1.75} className="size-5" />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs text-white/70">{copy.emailLabel}</dt>
                  <dd className="truncate font-medium">
                    <a href={`mailto:${email}`} className="underline-offset-4 hover:underline">
                      {email}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          {/* Form card */}
          <div
            data-contact-card
            className="relative rounded-[2rem] bg-white p-6 text-ink shadow-[0_40px_80px_-40px_rgb(10_10_10/0.6)] sm:p-9"
          >
            <ContactForm copy={copy.form} email={email} />
          </div>
        </div>
      </div>
    </section>
  );
}

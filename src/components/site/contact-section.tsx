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
 * "Contact / Invitation" section: a light rounded panel with the invitation pitch, request
 * topics and contact details on the left, and a white form card on the right. Royal blue
 * is kept for the highlight, icons and the send button.
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
    <section ref={sectionRef} id="contact" className="bg-white px-3 pt-8 pb-20 sm:px-6 sm:pb-24">
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-mist py-14 text-ink sm:py-20">
        {/* Decorative swooshes and glow */}
        <svg
          aria-hidden
          viewBox="0 0 400 400"
          className="absolute -top-24 -left-28 -z-10 size-[26rem] text-brand/[0.06]"
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
          className="absolute -right-40 -bottom-40 -z-10 size-[30rem] rounded-full bg-brand-soft/20 blur-3xl"
        />

        <div className="grid gap-10 px-5 sm:px-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:px-12">
          {/* Pitch and details */}
          <div className="lg:pt-6">
            <p
              data-contact-reveal
              className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-black/65"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-brand" />
              {copy.label}
            </p>
            <h2
              data-contact-heading
              className="mt-5 font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl"
            >
              {copy.headingLead} <span className="text-brand">{copy.headingHighlight}</span>
            </h2>
            <p data-contact-reveal className="mt-5 max-w-lg leading-relaxed text-black/60">
              {copy.intro}
            </p>

            <div data-contact-reveal className="mt-8">
              <p className="text-sm font-medium text-black/50">{copy.reasonsLabel}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {copy.reasons.map((reason) => (
                  <li
                    key={reason}
                    className="rounded-full bg-white px-3 py-1.5 text-[0.8rem] font-medium ring-1 ring-black/5"
                  >
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            <dl
              data-contact-reveal
              className="mt-8 grid max-w-md gap-3 sm:grid-cols-2 lg:grid-cols-1"
            >
              <div className="flex items-center gap-3.5 rounded-2xl bg-white p-3.5 ring-1 ring-black/5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-tint text-brand">
                  <MapPin aria-hidden strokeWidth={1.75} className="size-5" />
                </span>
                <div>
                  <dt className="text-xs text-black/50">{copy.locationLabel}</dt>
                  <dd className="text-sm font-medium">{location}</dd>
                </div>
              </div>
              <div className="flex items-center gap-3.5 rounded-2xl bg-white p-3.5 ring-1 ring-black/5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-tint text-brand">
                  <Mail aria-hidden strokeWidth={1.75} className="size-5" />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs text-black/50">{copy.emailLabel}</dt>
                  <dd className="truncate text-sm font-medium">
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
            className="relative rounded-[1.5rem] bg-white p-6 text-ink shadow-[0_24px_60px_-30px_rgb(10_10_10/0.3)] sm:p-8"
          >
            <ContactForm copy={copy.form} email={email} />
          </div>
        </div>
      </div>
    </section>
  );
}

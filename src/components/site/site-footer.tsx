import { ArrowRight, ArrowUp, Mail, type LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";

type FooterLink = { label: string; href: Route };

/**
 * Site footer: a black call-to-action panel with a glow from the top, then a white
 * footer card (logo, description, contact icons, link columns, copyright) floating on
 * a light grey panel, with the surname as a huge faint watermark underneath.
 */
export async function SiteFooter() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.footer;
  const home = localizePath(locale, "/");
  const contact = localizePath(locale, "/contact");
  const anchor = (id: string) => `${home}#${id}` as Route;

  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: t.exploreTitle,
      links: [
        { label: dict.nav.home, href: home },
        { label: dict.nav.about, href: localizePath(locale, "/about") },
        { label: dict.nav.teaching, href: localizePath(locale, "/teaching") },
        { label: dict.nav.contact, href: contact },
      ],
    },
    {
      title: t.ministryTitle,
      links: dict.about.features.map((feature) => ({
        label: feature.title,
        href: anchor("about"),
      })),
    },
    {
      title: t.connectTitle,
      links: [
        { label: t.inviteLink, href: contact },
        { label: t.prayerLink, href: contact },
      ],
    },
  ];

  // Lucide has no brand logos, so social profiles need their own icons once added.
  const contactIcons: { label: string; href: Route; icon: LucideIcon }[] = [
    { label: t.emailLabel, href: contact, icon: Mail },
  ];

  return (
    <footer aria-label={t.footerLabel} className="bg-white px-2 pb-2 sm:px-4 sm:pb-4">
      {/* Call to action */}
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink px-6 py-24 text-center text-white sm:rounded-[3rem] sm:py-32">
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -z-10 h-[170%] w-[min(84rem,170%)] -translate-x-1/2 -translate-y-[56%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_255_255),rgb(255_255_255/0.85)_30%,rgb(123_155_255/0.4)_55%,transparent)] blur-2xl"
        />
        <h2 className="mx-auto max-w-2xl font-heading text-4xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">
          {t.ctaTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/60">{t.ctaText}</p>
        <Link
          href={contact}
          className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-ink transition-colors hover:bg-brand hover:text-white"
        >
          {t.ctaButton}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Footer card on a grey panel, with the watermark */}
      <div className="relative mt-2 overflow-hidden rounded-[2rem] bg-[#f1f3f8] px-3 pt-14 sm:mt-4 sm:rounded-[3rem] sm:px-8 sm:pt-20">
        <div className="relative z-10 mx-auto max-w-6xl rounded-[1.75rem] bg-white p-7 shadow-[0_30px_60px_-30px_rgb(15_23_42/0.25)] ring-1 ring-black/5 sm:p-12">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
            <div>
              <Link href={home} className="inline-flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="grid size-9 place-items-center rounded-xl bg-brand font-heading text-sm font-bold text-white"
                >
                  SK
                </span>
                <span className="font-heading text-lg font-semibold tracking-tight">
                  {siteConfig.name}
                </span>
              </Link>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-black/55">{t.description}</p>
              <ul className="mt-6 flex gap-2">
                {contactIcons.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      aria-label={label}
                      className="grid size-10 place-items-center rounded-full bg-brand-tint text-brand transition-colors hover:bg-brand hover:text-white"
                    >
                      <Icon aria-hidden strokeWidth={1.75} className="size-[18px]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <nav aria-label={t.footerLabel} className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {columns.map((column) => (
                <div key={column.title}>
                  <h3 className="text-sm font-semibold">{column.title}</h3>
                  <ul className="mt-4 space-y-3">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-black/55 transition-colors hover:text-brand"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-black/10 pt-6 text-xs text-black/50 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © <CopyrightYear /> {siteConfig.name}. {t.rights}
            </p>
            <Link
              href={anchor("top")}
              className="inline-flex items-center gap-1.5 underline underline-offset-4 transition-colors hover:text-brand"
            >
              {t.backToTop}
              <ArrowUp aria-hidden className="size-3.5" />
            </Link>
          </div>
        </div>

        <p
          aria-hidden
          className="pointer-events-none mt-4 -mb-[4.5vw] text-center font-heading text-[21vw] leading-[0.8] font-bold tracking-tighter text-black/[0.045] select-none"
        >
          Kamedjieu
        </p>
      </div>
    </footer>
  );
}

/** Current year, cached so the page can still be prerendered (Cache Components). */
async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

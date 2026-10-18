import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { CopyEmail } from "@/components/site/copy-email";
import { siteConfig, siteNav } from "@/config/site";
import { localeLabels, locales } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath, sectionHref } from "@/i18n/routing";
import { currentYear } from "@/lib/current-year";

/**
 * Black site footer (LogoMint style): logo, a large statement whose royal-blue verb
 * cycles through three words, a contact row (email with copy button, invitations, JAFAN
 * website), then link columns and the copyright line.
 */
export async function SiteFooter() {
  const [locale, dict, year] = await Promise.all([getLocale(), getDictionary(), currentYear()]);
  const copy = dict.footer;
  const words = [...copy.words, copy.words[0]];
  const lead = copy.statementLead ? `${copy.statementLead} ` : "";
  const homeHref = localizePath(locale, "/");
  const menu = siteNav
    .filter((item) => item.hash)
    .map((item) => ({
      href: `${homeHref}#${item.hash}` as Route,
      label: dict.nav[item.key],
    }));

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-6xl px-5 pt-20 pb-10 sm:px-8 sm:pt-24">
        <Link
          href={homeHref}
          aria-label={`${siteConfig.name}, ${dict.nav.homeLink}`}
          className="inline-flex items-center gap-2.5"
        >
          <span
            aria-hidden
            className="grid size-9 place-items-center rounded-xl bg-brand font-heading text-sm font-bold"
          >
            SK
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

        {/* Statement with the cycling verb */}
        <p className="mt-12 max-w-4xl font-heading text-4xl leading-[1.1] font-medium tracking-tight text-white/90 sm:text-6xl lg:text-7xl">
          <span className="sr-only">
            {lead}
            {copy.words[0]} {copy.statementTail}
          </span>
          <span aria-hidden>
            {lead}
            <span className="inline-block h-[1.1em] overflow-hidden align-bottom text-brand-soft">
              <span className="footer-words flex flex-col">
                {words.map((word, i) => (
                  <span key={i} className="block h-[1.1em]">
                    {word}
                  </span>
                ))}
              </span>
            </span>
            <br />
            {copy.statementTail}
          </span>
        </p>

        {/* Contact row */}
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-sm font-medium">{copy.emailLabel}</p>
            <div className="mt-2 flex items-center gap-2">
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="truncate text-white/55 transition-colors hover:text-white"
              >
                {siteConfig.contactEmail}
              </a>
              <CopyEmail
                email={siteConfig.contactEmail}
                label={copy.copyEmail}
                copiedLabel={copy.copied}
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">{copy.inviteLabel}</p>
            <Link
              href={sectionHref(locale, "contact")}
              className="group mt-2 inline-flex items-center gap-1.5 text-white/55 transition-colors hover:text-white"
            >
              {dict.nav.cta}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
          <div>
            <p className="text-sm font-medium">{copy.ministryLabel}</p>
            <a
              href={siteConfig.jafanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-2 inline-flex items-center gap-1.5 text-white/55 transition-colors hover:text-white"
            >
              {copy.ministryLink}
              <span className="sr-only">{dict.ministries.newTab}</span>
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>

        <hr className="mt-12 border-white/10" />

        {/* Link columns */}
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 text-[0.8rem] md:grid-cols-[1fr_1.2fr_1.5fr_0.8fr]">
          <FooterColumn label={copy.menuLabel}>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {menu.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </FooterColumn>
          <FooterColumn label={copy.ministriesLabel}>
            <ul className="space-y-2">
              {dict.ministries.items.map((item) => (
                <li key={item.name}>
                  <FooterLink href={sectionHref(locale, "ministries")}>{item.name}</FooterLink>
                </li>
              ))}
            </ul>
          </FooterColumn>
          <FooterColumn label={copy.booksLabel}>
            <ul className="space-y-2">
              {dict.books.items.slice(0, 4).map((book) => (
                <li key={book.slug}>
                  <FooterLink href={sectionHref(locale, "books")}>{book.title}</FooterLink>
                </li>
              ))}
            </ul>
          </FooterColumn>
          <FooterColumn label={copy.languageLabel}>
            <ul className="space-y-2">
              {locales.map((l) => (
                <li key={l}>
                  <Link
                    href={localizePath(l, "/")}
                    hrefLang={l}
                    lang={l}
                    aria-current={l === locale ? "true" : undefined}
                    className={
                      l === locale
                        ? "text-white"
                        : "text-white/50 transition-colors hover:text-white"
                    }
                  >
                    {localeLabels[l]}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>
        </div>

        <div className="mt-14 flex flex-col gap-2 text-xs text-white/40 sm:flex-row sm:justify-between">
          <p>
            © {year} {siteConfig.name} · JAFAN Ministries. {copy.rights}
          </p>
          <p>{siteConfig.location}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <nav aria-label={label}>
      <p className="mb-3 font-medium text-white">{label}</p>
      {children}
    </nav>
  );
}

function FooterLink({ href, children }: { href: Route; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-white/50 transition-colors hover:text-white">
      {children}
    </Link>
  );
}

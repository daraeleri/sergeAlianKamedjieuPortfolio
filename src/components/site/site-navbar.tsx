"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

type NavLink = { href: Route; label: string };

type SiteNavbarProps = {
  locale: Locale;
  brand: string;
  homeHref: Route;
  links: NavLink[];
  cta: NavLink;
  labels: { main: string; language: string; openMenu: string; closeMenu: string; home: string };
};

/** Floating, rounded navbar. Collapses into a drop-down panel below the `lg` breakpoint. */
export function SiteNavbar({ locale, brand, homeHref, links, cta, labels }: SiteNavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  // Undefined when smooth scrolling is off (reduced motion).
  const lenis = useLenis();

  const isActive = (href: Route) =>
    href === homeHref ? pathname === href : pathname.startsWith(href);

  // While the mobile menu is open: lock page scroll, close on Escape or when
  // the viewport grows past the mobile breakpoint.
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const close = () => setOpen(false);
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    const onResize = (event: MediaQueryListEvent) => event.matches && close();

    // Lenis drives scrolling itself, so it must be paused as well as the body locked.
    lenis?.stop();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open, lenis]);

  const close = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      {/* Dim the page behind the open mobile menu. */}
      <div
        aria-hidden
        onClick={close}
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div className="relative mx-auto max-w-7xl rounded-2xl bg-white text-ink shadow-[0_8px_30px_rgb(0_0_0/0.12)]">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-5">
          <Link
            href={homeHref}
            onClick={close}
            aria-label={`${brand}, ${labels.home}`}
            className="flex min-w-0 items-center gap-2.5"
          >
            <span
              aria-hidden
              className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand font-heading text-sm font-bold text-white"
            >
              SK
            </span>
            <span className="truncate font-heading text-base font-semibold tracking-tight sm:text-lg">
              {brand}
            </span>
          </Link>

          <nav aria-label={labels.main} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium text-black/70 transition-colors hover:bg-black/5 hover:text-black",
                      isActive(link.href) && "text-black",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <LanguageSwitcher
              locale={locale}
              label={labels.language}
              display="code"
              className="hidden sm:flex"
            />
            <Link
              href={cta.href}
              className="hidden rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-strong md:inline-block"
            >
              {cta.label}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={open ? labels.closeMenu : labels.openMenu}
              className="grid size-10 place-items-center rounded-xl bg-ink text-white lg:hidden"
            >
              {open ? (
                <X aria-hidden className="size-5" />
              ) : (
                <Menu aria-hidden className="size-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <div
          id={panelId}
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-out lg:hidden",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden" inert={!open}>
            <nav
              aria-label={labels.main}
              className="border-t border-black/10 px-4 pt-3 pb-5 sm:px-5"
            >
              <ul className="flex flex-col">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={close}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-3 font-heading text-2xl font-semibold tracking-tight text-black/80 hover:bg-black/5",
                        isActive(link.href) && "text-brand-strong",
                      )}
                    >
                      {link.label}
                      <ArrowRight aria-hidden className="size-5 text-black/30" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-3">
                <LanguageSwitcher locale={locale} label={labels.language} display="code" />
                <Link
                  href={cta.href}
                  onClick={close}
                  className="rounded-xl bg-brand px-5 py-3 text-sm font-medium text-white hover:bg-brand-strong md:hidden"
                >
                  {cta.label}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

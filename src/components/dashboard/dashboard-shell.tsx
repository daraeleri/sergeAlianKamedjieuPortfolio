"use client";

import {
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  FileText,
  Inbox,
  LayoutDashboard,
  Menu,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type Copy = Dictionary["dashboard"];
type NavKey = "overview" | "analytics" | "articles" | "books" | "messages" | "settings";
type NavGroup = {
  label: keyof Copy["nav"];
  items: { key: NavKey; icon: LucideIcon; path: string }[];
};

const groups: NavGroup[] = [
  {
    label: "main",
    items: [
      { key: "overview", icon: LayoutDashboard, path: "/dashboard" },
      { key: "analytics", icon: BarChart3, path: "/dashboard/analytics" },
    ],
  },
  {
    label: "content",
    items: [
      { key: "articles", icon: FileText, path: "/dashboard/articles" },
      { key: "books", icon: BookOpen, path: "/dashboard/books" },
    ],
  },
  {
    label: "engagement",
    items: [{ key: "messages", icon: Inbox, path: "/dashboard/messages" }],
  },
  {
    label: "system",
    items: [{ key: "settings", icon: Settings, path: "/dashboard/settings" }],
  },
];

type ShellProps = {
  locale: Locale;
  copy: Copy;
  languageLabel: string;
  user: { name: string; avatar: string };
  /** Small counters next to nav items, e.g. open drafts and unread messages. */
  badges: Partial<Record<NavKey, number>>;
  children: ReactNode;
};

/**
 * Dashboard frame (after the Linear/Untitled-style references): fixed sidebar with the
 * workspace, grouped navigation and the user card; a top bar with breadcrumb, language
 * switch and shortcuts; the sidebar becomes a drawer below the `lg` breakpoint.
 */
export function DashboardShell({
  locale,
  copy,
  languageLabel,
  user,
  badges,
  children,
}: ShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const home = localizePath(locale, "/dashboard");

  const isActive = (path: string) => {
    const href = localizePath(locale, path as "/");
    return href === home ? pathname === href : pathname.startsWith(href);
  };
  const current = groups
    .flatMap((group) => group.items)
    .filter((item) => isActive(item.path))
    .pop();

  // Close the drawer on navigation and with Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* Workspace */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand font-heading text-sm font-bold text-white">
          SK
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold">{copy.workspace}</p>
          <p className="truncate text-xs text-black/45">{copy.workspaceRole}</p>
        </div>
      </div>

      <nav aria-label={copy.nav.label} className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[0.7rem] font-semibold tracking-[0.12em] text-black/40 uppercase">
              {copy.nav[group.label]}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.path);
                const badge = badges[item.key];
                return (
                  <li key={item.key}>
                    <Link
                      href={localizePath(locale, item.path as "/")}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-white text-ink shadow-[0_1px_2px_rgb(10_10_10/0.06)] ring-1 ring-black/5"
                          : "text-black/60 hover:bg-white/70 hover:text-ink",
                      )}
                    >
                      <item.icon
                        aria-hidden
                        strokeWidth={1.75}
                        className={cn("size-[1.1rem]", active ? "text-brand" : "text-black/45")}
                      />
                      {copy.nav[item.key]}
                      {badge ? (
                        <span
                          className={cn(
                            "ml-auto rounded-full px-1.5 py-0.5 text-[0.7rem] leading-none font-semibold tabular-nums",
                            item.key === "messages"
                              ? "bg-brand text-white"
                              : "bg-black/5 text-black/60",
                          )}
                        >
                          {badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* View site + user */}
      <div className="space-y-3 p-3">
        <Link
          href={localizePath(locale, "/")}
          className="group flex items-center justify-between rounded-xl bg-brand-tint px-3 py-2.5 text-sm font-medium text-brand-strong ring-1 ring-brand/10 transition-colors hover:bg-brand hover:text-white"
        >
          {copy.viewSite}
          <ArrowUpRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
        <div className="flex items-center gap-3 rounded-xl bg-white p-2.5 ring-1 ring-black/5">
          <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-brand-tint">
            <Image
              src={user.avatar}
              alt=""
              fill
              sizes="36px"
              className="origin-[50%_8%] scale-[2.2] object-cover object-top"
            />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-black/45">{copy.userRole}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-svh bg-mist text-ink">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-black/5 bg-mist lg:block">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        inert={!open}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-mist shadow-2xl transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={copy.closeMenu}
          className="absolute top-5 right-3 grid size-9 place-items-center rounded-lg text-black/60 hover:bg-white"
        >
          <X aria-hidden className="size-5" />
        </button>
        {sidebar}
      </aside>

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-black/5 bg-mist/85 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={copy.openMenu}
            className="grid size-9 place-items-center rounded-lg bg-white text-black/70 ring-1 ring-black/5 lg:hidden"
          >
            <Menu aria-hidden className="size-5" />
          </button>
          <p className="flex min-w-0 items-center gap-2 text-sm">
            <span className="hidden text-black/45 sm:inline">{copy.title}</span>
            <span aria-hidden className="hidden text-black/25 sm:inline">
              /
            </span>
            <span className="truncate font-medium">
              {current ? copy.nav[current.key] : copy.title}
            </span>
          </p>
          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher locale={locale} label={languageLabel} display="code" />
            <Link
              href={localizePath(locale, "/dashboard/messages")}
              aria-label={copy.notifications}
              className="relative grid size-9 place-items-center rounded-lg bg-white text-black/65 ring-1 ring-black/5 transition-colors hover:text-brand"
            >
              <Bell aria-hidden className="size-[1.1rem]" />
              {badges.messages ? (
                <span className="absolute top-2 right-2 size-2 rounded-full bg-brand ring-2 ring-white" />
              ) : null}
            </Link>
          </div>
        </header>

        <p className="border-b border-brand/10 bg-brand-tint px-4 py-2 text-center text-xs text-brand-strong sm:px-6">
          {copy.sampleNotice}
        </p>

        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

/** Page title row used at the top of every dashboard page. */
export function DashboardPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1.5 text-sm text-black/55">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/** Primary dashboard button-link (e.g. "New article"). */
export function DashboardButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: Route;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
        variant === "primary"
          ? "bg-brand text-white shadow-[0_8px_20px_-10px] shadow-brand hover:bg-brand-strong"
          : "bg-white text-ink ring-1 ring-black/10 hover:bg-brand-tint",
      )}
    >
      {children}
    </Link>
  );
}

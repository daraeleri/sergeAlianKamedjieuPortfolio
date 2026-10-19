import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SignInForm } from "@/components/dashboard/sign-in-form";
import { siteConfig } from "@/config/site";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.auth.metaTitle, robots: { index: false, follow: false } };
}

/** Dashboard sign-in. */
export default async function SignInPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const copy = dict.auth;

  return (
    <main className="grid min-h-svh place-items-center bg-mist px-4 py-16 text-ink">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-brand font-heading text-sm font-semibold text-white">
            SK
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">{dict.dashboard.workspace}</p>
            <p className="text-xs text-black/50">{siteConfig.name}</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-xl ring-1 shadow-black/[0.04] ring-black/5 sm:p-7">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">{copy.title}</h1>
          <p className="mt-1.5 text-sm text-black/55">{copy.intro}</p>
          {/* Reads ?next= on the client, so it sits behind a boundary. */}
          <Suspense>
            <SignInForm locale={locale} copy={copy} />
          </Suspense>
        </div>

        <Link
          href={localizePath(locale, "/")}
          className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-black/55 hover:text-brand-strong"
        >
          <ArrowLeft
            aria-hidden
            className="size-4 transition-transform group-hover:-translate-x-0.5"
          />
          {copy.backToSite}
        </Link>
      </div>
    </main>
  );
}

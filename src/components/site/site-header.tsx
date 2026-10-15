import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { siteConfig, siteNav } from "@/config/site";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";

export async function SiteHeader() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-4">
        <Link href={localizePath(locale, "/")} className="font-semibold">
          {siteConfig.name}
        </Link>
        <div className="flex flex-wrap items-center gap-6">
          <nav aria-label={dict.nav.main}>
            <ul className="flex flex-wrap gap-5 text-sm">
              {siteNav.map((item) => (
                <li key={item.key}>
                  <Link
                    href={localizePath(locale, item.href)}
                    className="text-muted hover:text-foreground"
                  >
                    {dict.nav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <LanguageSwitcher locale={locale} label={dict.nav.language} />
        </div>
      </div>
    </header>
  );
}

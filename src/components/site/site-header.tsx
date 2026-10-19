import type { Route } from "next";
import { SiteNavbar } from "@/components/site/site-navbar";
import { siteConfig, siteNav } from "@/config/site";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath, sectionHref } from "@/i18n/routing";
import { getEmptySections } from "@/lib/content";

/** Server wrapper: resolves locale and copy, then renders the interactive navbar. */
export async function SiteHeader() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const empty = await getEmptySections(locale);

  return (
    <SiteNavbar
      locale={locale}
      brand={siteConfig.name}
      homeHref={localizePath(locale, "/")}
      links={siteNav
        .filter((item) => item.key !== "home" && !empty.has(item.key))
        .map((item) => ({
          href: (item.hash
            ? `${localizePath(locale, item.href)}#${item.hash}`
            : localizePath(locale, item.href)) as Route,
          label: dict.nav[item.key],
        }))}
      cta={{ href: sectionHref(locale, "contact"), label: dict.nav.cta }}
      labels={{
        main: dict.nav.main,
        language: dict.nav.language,
        openMenu: dict.nav.openMenu,
        closeMenu: dict.nav.closeMenu,
        home: dict.nav.homeLink,
      }}
    />
  );
}

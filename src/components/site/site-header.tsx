import { SiteNavbar } from "@/components/site/site-navbar";
import { siteConfig, siteNav } from "@/config/site";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";

/** Server wrapper: resolves locale and copy, then renders the interactive navbar. */
export async function SiteHeader() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <SiteNavbar
      locale={locale}
      brand={siteConfig.name}
      homeHref={localizePath(locale, "/")}
      links={siteNav
        .filter((item) => item.key !== "home")
        .map((item) => ({ href: localizePath(locale, item.href), label: dict.nav[item.key] }))}
      cta={{ href: localizePath(locale, "/contact"), label: dict.nav.cta }}
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

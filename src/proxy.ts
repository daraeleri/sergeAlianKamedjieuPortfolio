import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, LOCALE_COOKIE, locales, type Locale } from "@/i18n/config";

/** Same name as in lib/auth/session.ts (that module is server-only, so not imported here). */
const SESSION_COOKIE = "sak_session";

function getPreferredLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (hasLocale(cookieLocale)) return cookieLocale;

  const headers = { "accept-language": request.headers.get("accept-language") ?? "" };
  const languages = new Negotiator({ headers }).languages();
  try {
    return match(languages, locales, defaultLocale) as Locale;
  } catch {
    // `match` throws on malformed language tags such as "*".
    return defaultLocale;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];
  if (hasLocale(firstSegment)) {
    // Quick check only (is there a session cookie?); the dashboard layout verifies it.
    const isDashboard =
      pathname === `/${firstSegment}/dashboard` ||
      pathname.startsWith(`/${firstSegment}/dashboard/`);
    if (isDashboard && !request.cookies.has(SESSION_COOKIE)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${firstSegment}/login`;
      url.search = "";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${getPreferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next.js internals, API routes, the generated iPhone icon (no extension) and
  // any file with an extension (favicon.ico, robots.txt, sitemap.xml, images in /public, ...).
  matcher: ["/((?!api|_next|apple-icon|.*\\..*).*)"],
};

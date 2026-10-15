import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, LOCALE_COOKIE, locales, type Locale } from "@/i18n/config";

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
  if (hasLocale(firstSegment)) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${getPreferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next.js internals, API routes and any file with an extension
  // (favicon.ico, robots.txt, sitemap.xml, images in /public, ...).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

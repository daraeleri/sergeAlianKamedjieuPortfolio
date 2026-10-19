import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale } from "@/i18n/config";
import { unsubscribe } from "@/lib/newsletter";

/**
 * One-click unsubscribe (RFC 8058): mail apps POST here from the "List-Unsubscribe"
 * header. A plain visit (GET) only opens the unsubscribe page, so link scanners that
 * open every URL in an email can't unsubscribe anyone.
 */
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  if (token.length < 20 || token.length > 100) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const ok = await unsubscribe(token);
  return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
}

export function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const url = new URL(`/${defaultLocale}/newsletter/unsubscribe`, request.url);
  url.hash = token;
  return NextResponse.redirect(url);
}

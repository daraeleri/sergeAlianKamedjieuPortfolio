import { createHash } from "node:crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { isBot, parseUserAgent, referrerSource } from "@/lib/analytics/user-agent";

/**
 * Receives page views, reading time, reads and shares from the public site.
 *
 * Privacy: no cookies and no IP addresses are stored. A visitor is a hash of the IP,
 * browser and day with a secret salt (ANALYTICS_SALT), so visits on the same day can be
 * counted without being able to identify or follow anyone. Location comes from the
 * hosting platform's headers (Vercel), at city level.
 */

const path = z.string().max(300).startsWith("/");

const payload = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("view"),
    path,
    referrer: z.string().max(500).optional(),
    locale: z.enum(["en", "fr"]).optional(),
    articleId: z.string().max(120).optional(),
  }),
  z.object({
    type: z.literal("leave"),
    id: z.string().regex(/^\d{1,18}$/),
    duration: z
      .number()
      .int()
      .min(0)
      .max(4 * 60 * 60),
  }),
  z.object({
    type: z.literal("read"),
    path,
    articleId: z.string().max(120).optional(),
  }),
  z.object({
    type: z.literal("share"),
    path,
    articleId: z.string().max(120).optional(),
    channel: z.enum(["whatsapp", "copy", "email", "native"]),
  }),
]);

function visitorId(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "";
  const day = new Date().toISOString().slice(0, 10);
  const salt = process.env.ANALYTICS_SALT ?? "";
  return createHash("sha256")
    .update(`${salt}|${day}|${ip}|${request.headers.get("user-agent") ?? ""}`)
    .digest("hex")
    .slice(0, 32);
}

/** A location header from the host, decoded (city names arrive URL-encoded). */
function header(request: Request, name: string) {
  const value = request.headers.get(name);
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function coordinate(request: Request, name: string) {
  const value = request.headers.get(name);
  return value && Number.isFinite(Number(value)) ? Number(value) : null;
}

export async function POST(request: Request) {
  const ua = request.headers.get("user-agent") ?? "";
  if (isBot(ua)) return new Response(null, { status: 204 });

  let body: unknown;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  const parsed = payload.safeParse(body);
  if (!parsed.success) return new Response(null, { status: 400 });
  const data = parsed.data;

  try {
    if (data.type === "leave") {
      // Only the first report counts, so a view can't be given another duration later.
      await db.pageView.updateMany({
        where: { id: BigInt(data.id), duration: null },
        data: { duration: data.duration },
      });
      return new Response(null, { status: 204 });
    }

    if (data.type === "view") {
      if (/^\/(en|fr)\/(dashboard|login)(\/|$)/.test(data.path)) {
        return new Response(null, { status: 204 });
      }
      const view = await db.pageView.create({
        data: {
          visitorId: visitorId(request),
          path: data.path,
          locale: data.locale,
          articleId: data.articleId,
          source: referrerSource(data.referrer, request.headers.get("host")),
          referrer: data.referrer,
          country: request.headers.get("x-vercel-ip-country"),
          region: header(request, "x-vercel-ip-country-region"),
          city: header(request, "x-vercel-ip-city"),
          latitude: coordinate(request, "x-vercel-ip-latitude"),
          longitude: coordinate(request, "x-vercel-ip-longitude"),
          ...parseUserAgent(ua),
        },
        select: { id: true },
      });
      return Response.json({ id: view.id.toString() });
    }

    await db.event.create({
      data: {
        type: data.type,
        visitorId: visitorId(request),
        path: data.path,
        articleId: data.articleId,
        channel: data.type === "share" ? data.channel : undefined,
      },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[track] Could not record:", error);
    return new Response(null, { status: 500 });
  }
}

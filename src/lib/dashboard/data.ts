import "server-only";
import { connection } from "next/server";
import type { ArticleBlock } from "@/content/article-bodies";
import type { Article, Book } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import type {
  ArticleDoc,
  Bilingual,
  BookDoc,
  City,
  Country,
  DeviceType,
  InboxMessage,
  Referrer,
  ShareChannel,
  SubscriberRow,
} from "./types";

/**
 * Dashboard data, read live from the database on every request (the dashboard is
 * private, so nothing here is cached). Analytics cover the last 12 months unless
 * noted otherwise.
 */

const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

function since() {
  return new Date(Date.now() - YEAR_MS);
}

/** Article view, read and share counts, keyed by article id. */
async function articleEngagement() {
  const [views, events] = await Promise.all([
    db.pageView.groupBy({
      by: ["articleId"],
      where: { articleId: { not: null } },
      _count: { _all: true },
    }),
    db.event.groupBy({
      by: ["articleId", "type"],
      where: { articleId: { not: null } },
      _count: { _all: true },
    }),
  ]);
  const stats = new Map<string, { views: number; reads: number; shares: number }>();
  const entry = (id: string) => {
    let value = stats.get(id);
    if (!value) stats.set(id, (value = { views: 0, reads: 0, shares: 0 }));
    return value;
  };
  for (const row of views) entry(row.articleId!).views = row._count._all;
  for (const row of events) {
    entry(row.articleId!)[row.type === "read" ? "reads" : "shares"] = row._count._all;
  }
  return stats;
}

function toArticleDoc(
  row: Article,
  stats?: { views: number; reads: number; shares: number },
): ArticleDoc {
  return {
    id: row.id,
    status: row.status,
    category: { en: row.categoryEn, fr: row.categoryFr },
    title: { en: row.titleEn, fr: row.titleFr },
    excerpt: { en: row.excerptEn, fr: row.excerptFr },
    cover: row.cover ?? `theme:${row.theme}`,
    body: { en: row.bodyEn as ArticleBlock[], fr: row.bodyFr as ArticleBlock[] },
    updatedAt: row.updatedAt.toISOString(),
    views: stats?.views ?? 0,
    reads: stats?.reads ?? 0,
    shares: stats?.shares ?? 0,
    announced: announcement(row),
  };
}

function announcement(row: { announcedAt: Date | null; announcedTo: number | null }) {
  return row.announcedAt
    ? { at: row.announcedAt.toISOString(), to: row.announcedTo ?? 0 }
    : undefined;
}

function toBookDoc(row: Book): BookDoc {
  return {
    id: row.id,
    status: row.status,
    title: row.title,
    description: { en: row.descriptionEn, fr: row.descriptionFr },
    tags: { en: row.tagsEn, fr: row.tagsFr },
    cover: row.cover ?? undefined,
    pages: row.pages ?? undefined,
    year: row.year ?? undefined,
    updatedAt: row.updatedAt.toISOString(),
    // Book pages and per-book orders aren't tracked yet; orders arrive as messages.
    views: 0,
    orders: 0,
    announced: announcement(row),
  };
}

export async function getDashboardArticles(): Promise<ArticleDoc[]> {
  await connection();
  const [rows, stats] = await Promise.all([
    db.article.findMany({ orderBy: { updatedAt: "desc" } }),
    articleEngagement(),
  ]);
  return rows.map((row) => toArticleDoc(row, stats.get(row.id)));
}

export async function getDashboardArticle(id: string) {
  await connection();
  const row = await db.article.findUnique({ where: { id } });
  return row ? toArticleDoc(row) : undefined;
}

export async function getDashboardBooks(): Promise<BookDoc[]> {
  await connection();
  const rows = await db.book.findMany({ orderBy: [{ position: "asc" }, { createdAt: "asc" }] });
  return rows.map(toBookDoc);
}

export async function getDashboardBook(id: string) {
  await connection();
  const row = await db.book.findUnique({ where: { id } });
  return row ? toBookDoc(row) : undefined;
}

/** Number of confirmed newsletter subscribers. */
export async function getActiveSubscriberCount() {
  await connection();
  return db.subscriber.count({ where: { status: "active" } });
}

export async function getSubscribers(): Promise<SubscriberRow[]> {
  await connection();
  const rows = await db.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((row) => ({
    id: row.id,
    email: row.email,
    locale: row.locale,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function getMessages(): Promise<InboxMessage[]> {
  await connection();
  const rows = await db.message.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    organization: row.organization ?? undefined,
    type: row.type,
    message: row.message,
    receivedAt: row.createdAt.toISOString(),
    read: row.read,
  }));
}

/** Months from 11 months ago to the current one, as UTC month starts. */
function lastTwelveMonths() {
  const now = new Date();
  return Array.from(
    { length: 12 },
    (_, i) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11 + i, 1)),
  );
}

async function monthlyCounts(table: "views" | "reads" | "shares" | "invitations") {
  const start = lastTwelveMonths()[0];
  const rows =
    table === "views"
      ? await db.$queryRaw<{ month: Date; count: bigint }[]>`
          SELECT date_trunc('month', "createdAt") AS month, count(*) AS count
          FROM "PageView" WHERE "createdAt" >= ${start} GROUP BY 1`
      : table === "invitations"
        ? await db.$queryRaw<{ month: Date; count: bigint }[]>`
          SELECT date_trunc('month', "createdAt") AS month, count(*) AS count
          FROM "Message" WHERE "createdAt" >= ${start} AND type = 'invitation' GROUP BY 1`
        : await db.$queryRaw<{ month: Date; count: bigint }[]>`
          SELECT date_trunc('month', "createdAt") AS month, count(*) AS count
          FROM "Event" WHERE "createdAt" >= ${start}
            AND type = ${table === "reads" ? "read" : "share"}::"EventType" GROUP BY 1`;
  const byMonth = new Map(rows.map((row) => [row.month.toISOString(), Number(row.count)]));
  return lastTwelveMonths().map((month) => byMonth.get(month.toISOString()) ?? 0);
}

/** Monthly views and article reads for the last 12 months, oldest first. */
export async function getMonthlyAudience() {
  await connection();
  const [views, reads] = await Promise.all([monthlyCounts("views"), monthlyCounts("reads")]);
  return lastTwelveMonths().map((month, i) => ({ month, views: views[i], reads: reads[i] }));
}

/** This month against last month, with the 12-month series behind each mini chart. */
function kpi(series: number[]) {
  return { value: series[11], previous: series[10], series };
}

export async function getKpis() {
  await connection();
  const [views, reads, shares, invitations, reading, visits, bookOrders] = await Promise.all([
    monthlyCounts("views"),
    monthlyCounts("reads"),
    monthlyCounts("shares"),
    monthlyCounts("invitations"),
    db.pageView.aggregate({
      where: { articleId: { not: null }, duration: { gt: 0 }, createdAt: { gte: since() } },
      _avg: { duration: true },
    }),
    db.$queryRaw<{ count: bigint }[]>`
      SELECT count(DISTINCT ("visitorId", date_trunc('day', "createdAt"))) AS count
      FROM "PageView" WHERE "createdAt" >= ${since()}`,
    db.message.count({ where: { type: "books", createdAt: { gte: since() } } }),
  ]);
  return {
    views: kpi(views),
    reads: kpi(reads),
    shares: kpi(shares),
    invitations: kpi(invitations),
    avgReadMinutes: Math.round(((reading._avg.duration ?? 0) / 60) * 10) / 10,
    visits: Number(visits[0]?.count ?? 0),
    bookOrders,
  };
}

export async function getShareChannels(): Promise<{ channel: ShareChannel; count: number }[]> {
  await connection();
  const rows = await db.event.groupBy({
    by: ["channel"],
    where: { type: "share", createdAt: { gte: since() } },
    _count: { _all: true },
    orderBy: { _count: { channel: "desc" } },
  });
  const channels = new Set<string>(["whatsapp", "copy", "email", "native"]);
  return rows
    .filter((row) => row.channel && channels.has(row.channel))
    .map((row) => ({ channel: row.channel as ShareChannel, count: row._count._all }));
}

const countryNames = {
  en: new Intl.DisplayNames("en", { type: "region" }),
  fr: new Intl.DisplayNames("fr", { type: "region" }),
};

function countryName(code: string): Bilingual {
  try {
    return { en: countryNames.en.of(code) ?? code, fr: countryNames.fr.of(code) ?? code };
  } catch {
    return { en: code, fr: code };
  }
}

type PlaceRow = { key: string; country: string; visitors: bigint; lat: number; lng: number };

/** Visitors by country, with the average position of their cities for the map. */
export async function getCountries(): Promise<Country[]> {
  await connection();
  const rows = await db.$queryRaw<PlaceRow[]>`
    SELECT country AS key, country, count(DISTINCT "visitorId") AS visitors,
      coalesce(avg(latitude), 0) AS lat, coalesce(avg(longitude), 0) AS lng
    FROM "PageView" WHERE "createdAt" >= ${since()} AND country IS NOT NULL
    GROUP BY country ORDER BY visitors DESC LIMIT 40`;
  return rows.map((row) => ({
    code: row.country,
    name: countryName(row.country),
    visitors: Number(row.visitors),
    lat: Number(row.lat),
    lng: Number(row.lng),
  }));
}

export async function getCities(): Promise<City[]> {
  await connection();
  const rows = await db.$queryRaw<PlaceRow[]>`
    SELECT city AS key, country, count(DISTINCT "visitorId") AS visitors,
      coalesce(avg(latitude), 0) AS lat, coalesce(avg(longitude), 0) AS lng
    FROM "PageView" WHERE "createdAt" >= ${since()} AND city IS NOT NULL AND country IS NOT NULL
    GROUP BY city, country ORDER BY visitors DESC LIMIT 40`;
  return rows.map((row) => ({
    name: row.key,
    country: row.country,
    visitors: Number(row.visitors),
    lat: Number(row.lat),
    lng: Number(row.lng),
  }));
}

/** Visitors by region (state or province code, as reported by the host). */
export async function getRegions(): Promise<
  { name: Bilingual; country: string; visitors: number }[]
> {
  await connection();
  const rows = await db.$queryRaw<{ region: string; country: string; visitors: bigint }[]>`
    SELECT region, country, count(DISTINCT "visitorId") AS visitors
    FROM "PageView" WHERE "createdAt" >= ${since()} AND region IS NOT NULL AND country IS NOT NULL
    GROUP BY region, country ORDER BY visitors DESC LIMIT 20`;
  return rows.map((row) => ({
    name: { en: row.region, fr: row.region },
    country: row.country,
    visitors: Number(row.visitors),
  }));
}

type PathRow = { path: string; visitors: bigint };

/** Most visited pages: overall, first page of a visit and last page of a visit. */
export async function getPageStats() {
  await connection();
  const start = since();
  const [top, entered, exited] = await Promise.all([
    db.$queryRaw<PathRow[]>`
      SELECT path, count(DISTINCT "visitorId") AS visitors FROM "PageView"
      WHERE "createdAt" >= ${start} GROUP BY path ORDER BY visitors DESC LIMIT 10`,
    db.$queryRaw<PathRow[]>`
      SELECT path, count(*) AS visitors FROM (
        SELECT DISTINCT ON ("visitorId") path FROM "PageView"
        WHERE "createdAt" >= ${start} ORDER BY "visitorId", "createdAt" ASC
      ) visits GROUP BY path ORDER BY visitors DESC LIMIT 10`,
    db.$queryRaw<PathRow[]>`
      SELECT path, count(*) AS visitors FROM (
        SELECT DISTINCT ON ("visitorId") path FROM "PageView"
        WHERE "createdAt" >= ${start} ORDER BY "visitorId", "createdAt" DESC
      ) visits GROUP BY path ORDER BY visitors DESC LIMIT 10`,
  ]);
  const toRows = (rows: PathRow[]) =>
    rows.map((row) => ({ path: row.path, visitors: Number(row.visitors) }));
  return { top: toRows(top), entered: toRows(entered), exited: toRows(exited) };
}

async function countBy(column: "source" | "browser" | "os" | "device" | "locale") {
  const rows = await db.$queryRawUnsafe<{ name: string | null; visitors: bigint }[]>(
    `SELECT "${column}" AS name, count(DISTINCT "visitorId") AS visitors FROM "PageView"
     WHERE "createdAt" >= $1 GROUP BY 1 ORDER BY visitors DESC LIMIT 10`,
    since(),
  );
  return rows
    .filter((row) => row.name)
    .map((row) => ({ name: row.name!, visitors: Number(row.visitors) }));
}

/** Where visitors came from. */
export async function getReferrers(): Promise<{ source: Referrer; visitors: number }[]> {
  await connection();
  return (await countBy("source"))
    .filter((row) => row.name !== "internal")
    .map((row) => ({
      source: row.name as Referrer,
      visitors: row.visitors,
    }));
}

/** Browsers, operating systems and device types of visitors. */
export async function getDeviceStats() {
  await connection();
  const [browsers, os, devices] = await Promise.all([
    countBy("browser"),
    countBy("os"),
    countBy("device"),
  ]);
  return {
    browsers,
    os,
    devices: devices as { name: DeviceType; visitors: number }[],
  };
}

/** Share of page views in each site language, in percent. */
export async function getReadingLanguages() {
  await connection();
  const rows = await countBy("locale");
  const fr = rows.find((row) => row.name === "fr")?.visitors ?? 0;
  const en = rows.find((row) => row.name === "en")?.visitors ?? 0;
  const total = fr + en;
  if (!total) return { fr: 0, en: 0 };
  const frPercent = Math.round((fr / total) * 100);
  return { fr: frPercent, en: 100 - frPercent };
}

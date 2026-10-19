import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

/** Readers right now, for the dashboard's live map. Signed-in users only. */
export async function GET() {
  if (!(await getCurrentUser())) return new Response(null, { status: 401 });

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const [active, recent] = await Promise.all([
    db.pageView.findMany({
      where: { createdAt: { gte: fiveMinutesAgo } },
      distinct: ["visitorId"],
      select: { visitorId: true },
    }),
    db.pageView.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        path: true,
        articleId: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true,
        createdAt: true,
      },
    }),
  ]);

  return Response.json(
    {
      readingNow: active.length,
      recent: recent.map((view) => ({
        id: view.id.toString(),
        path: view.path,
        articleId: view.articleId,
        city: view.city,
        country: view.country,
        lat: view.latitude,
        lng: view.longitude,
        at: view.createdAt.toISOString(),
      })),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

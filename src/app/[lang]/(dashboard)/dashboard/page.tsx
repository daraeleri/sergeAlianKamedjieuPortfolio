import { ArrowRight, BookOpen, CircleCheck, FilePen, Mail, Plus, Share2 } from "lucide-react";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { PixelChart } from "@/components/dashboard/charts";
import { DashboardButtonLink, DashboardPageHeader } from "@/components/dashboard/dashboard-shell";
import {
  Card,
  ContentThumb,
  Delta,
  fill,
  ProgressBar,
  Sparkbars,
  StatusBadge,
} from "@/components/dashboard/ui";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";
import {
  getDashboardArticles,
  getKpis,
  getMessages,
  getMonthlyAudience,
} from "@/lib/dashboard/data";
import { articleReadiness } from "@/lib/dashboard/readiness";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = (await getDictionary()).dashboard.overview;
  return { title, description };
}

export default async function DashboardPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const copy = dict.dashboard;
  const number = new Intl.NumberFormat(locale);
  const shortDate = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  const month = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" });

  const kpis = getKpis();
  const articles = getDashboardArticles();
  const pipeline = articles.filter((article) => article.status !== "published").slice(0, 4);
  const top = articles
    .filter((article) => article.status === "published")
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
  const messages = getMessages();
  const audience = getMonthlyAudience();
  const editHref = (id: string) => localizePath(locale, `/dashboard/articles/${id}`);

  const kpiCards = [
    { key: "views", tone: "brand", ...kpis.views },
    { key: "reads", tone: "ink", ...kpis.reads },
    { key: "shares", tone: "emerald", ...kpis.shares },
    { key: "invitations", tone: "amber", ...kpis.invitations },
  ] as const;

  const latestPublished = articles.find((article) => article.status === "published");
  const latestDraft = pipeline[0];
  const activity = [
    {
      icon: Mail,
      text: copy.overview.activity.invitation,
      detail: messages[0]?.name,
      date: messages[0]?.receivedAt,
    },
    {
      icon: FilePen,
      text: copy.overview.activity.draft,
      detail: latestDraft?.title[locale] || latestDraft?.title.en,
      date: latestDraft?.updatedAt,
    },
    {
      icon: Share2,
      text: fill(copy.overview.activity.share, { count: 37 }),
      detail: top[0]?.title[locale],
      date: "2026-10-19T08:00:00Z",
    },
    {
      icon: CircleCheck,
      text: copy.overview.activity.published,
      detail: latestPublished?.title[locale],
      date: latestPublished?.updatedAt,
    },
  ];

  return (
    <>
      <DashboardPageHeader
        title={fill(copy.overview.greeting, { name: "Prof. Kamedjieu" })}
        description={copy.overview.greetingText}
        actions={
          <>
            <DashboardButtonLink
              href={localizePath(locale, "/dashboard/books/new")}
              variant="secondary"
            >
              <BookOpen aria-hidden className="size-4" />
              {copy.common.newBook}
            </DashboardButtonLink>
            <DashboardButtonLink href={localizePath(locale, "/dashboard/articles/new")}>
              <Plus aria-hidden className="size-4" />
              {copy.common.newArticle}
            </DashboardButtonLink>
          </>
        }
      />

      {/* KPIs */}
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((kpi) => (
          <li key={kpi.key} className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
            <p className="text-xs font-semibold tracking-[0.08em] text-black/45 uppercase">
              {copy.overview.kpis[kpi.key]}
            </p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="font-heading text-3xl font-semibold tracking-tight tabular-nums">
                {number.format(kpi.value)}
              </p>
              <Sparkbars series={kpi.series} tone={kpi.tone} />
            </div>
            <div className="mt-3 border-t border-black/5 pt-3">
              <Delta value={kpi.value} previous={kpi.previous} label={copy.common.vsLastMonth} />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Audience */}
        <Card
          title={copy.overview.trendTitle}
          description={copy.common.last12Months}
          action={
            <div className="text-right">
              <p className="text-xs text-black/45">{copy.overview.trendTotal}</p>
              <p className="font-heading text-xl font-semibold tabular-nums">
                {number.format(audience.reduce((total, point) => total + point.views, 0))}
              </p>
            </div>
          }
        >
          <PixelChart
            locale={locale}
            label={copy.overview.trendTitle}
            legend={{ primary: copy.overview.legendViews, secondary: copy.overview.legendReads }}
            data={audience.map((point) => ({
              label: month.format(point.month),
              value: point.views,
              secondary: point.reads,
            }))}
          />
        </Card>

        {/* Pipeline */}
        <Card
          title={copy.overview.pipelineTitle}
          description={copy.overview.pipelineText}
          action={
            <SeeAll href={localizePath(locale, "/dashboard/articles")} label={copy.common.seeAll} />
          }
          bodyClassName="p-2"
        >
          <ul>
            {pipeline.map((article) => {
              const readiness = articleReadiness(article);
              return (
                <li key={article.id}>
                  <Link
                    href={editHref(article.id)}
                    className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-mist"
                  >
                    <ContentThumb cover={article.cover} kind="article" className="size-11" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-1 text-sm font-medium">
                          {article.title[locale] || article.title.en}
                        </p>
                        <StatusBadge status={article.status} label={copy.status[article.status]} />
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <ProgressBar percent={readiness.percent} label={copy.common.progress} />
                        <span className="shrink-0 text-xs font-semibold text-black/55 tabular-nums">
                          {readiness.percent}%
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Top articles */}
        <Card
          title={copy.overview.topTitle}
          action={
            <SeeAll
              href={localizePath(locale, "/dashboard/analytics")}
              label={copy.common.seeAll}
            />
          }
          bodyClassName="px-0 pb-2 pt-3"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-sm">
              <thead>
                <tr className="text-left text-xs text-black/45">
                  <th className="px-5 py-2 font-medium">#</th>
                  <th className="py-2 font-medium">{copy.articles.columns.title}</th>
                  <th className="px-3 py-2 text-right font-medium">{copy.common.views}</th>
                  <th className="px-3 py-2 text-right font-medium">{copy.common.reads}</th>
                  <th className="px-5 py-2 text-right font-medium">{copy.common.shares}</th>
                </tr>
              </thead>
              <tbody>
                {top.map((article, i) => (
                  <tr key={article.id} className="border-t border-black/5">
                    <td className="px-5 py-3 text-xs font-semibold text-black/35 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td className="py-3">
                      <Link
                        href={editHref(article.id)}
                        className="flex items-center gap-3 hover:text-brand-strong"
                      >
                        <ContentThumb cover={article.cover} kind="article" className="size-9" />
                        <span className="line-clamp-1 font-medium">{article.title[locale]}</span>
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {number.format(article.views)}
                    </td>
                    <td className="px-3 py-3 text-right text-black/60 tabular-nums">
                      {Math.round((article.reads / article.views) * 100)}%
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {number.format(article.shares)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid gap-4">
          {/* Messages */}
          <Card
            title={copy.overview.messagesTitle}
            action={
              <SeeAll
                href={localizePath(locale, "/dashboard/messages")}
                label={copy.common.seeAll}
              />
            }
            bodyClassName="p-2"
          >
            <ul>
              {messages.slice(0, 3).map((message) => (
                <li key={message.id}>
                  <Link
                    href={
                      `${localizePath(locale, "/dashboard/messages")}?id=${message.id}` as Route
                    }
                    className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-mist"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-tint text-xs font-semibold text-brand-strong">
                      {message.name.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-sm">
                        <span className={cn("truncate", !message.read && "font-semibold")}>
                          {message.name}
                        </span>
                        {!message.read ? (
                          <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                        ) : null}
                        <span className="ml-auto shrink-0 text-xs text-black/40">
                          {shortDate.format(new Date(message.receivedAt))}
                        </span>
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-black/50">{message.message}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          {/* Activity */}
          <Card title={copy.overview.activityTitle}>
            <ol className="relative space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[0.95rem] before:w-px before:bg-black/10">
              {activity.map((item) => (
                <li key={item.text} className="relative flex gap-3">
                  <span className="z-10 grid size-8 shrink-0 place-items-center rounded-full bg-white text-brand ring-1 ring-black/10">
                    <item.icon aria-hidden className="size-3.5" />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-medium">{item.text}</p>
                    <p className="line-clamp-1 text-xs text-black/50">
                      {item.detail}
                      {item.date ? ` · ${shortDate.format(new Date(item.date))}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </>
  );
}

function SeeAll({ href, label }: { href: Route; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex shrink-0 items-center gap-1 text-xs font-medium text-black/55 hover:text-brand-strong"
    >
      {label}
      <ArrowRight
        aria-hidden
        className="size-3.5 transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}

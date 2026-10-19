import {
  Clock,
  Link2,
  Mail,
  MessageCircle,
  Repeat,
  Share2,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BarChart } from "@/components/dashboard/charts";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-shell";
import { Card, ContentThumb, fill } from "@/components/dashboard/ui";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";
import {
  getCountries,
  getDashboardArticles,
  getDashboardBooks,
  getKpis,
  getMonthlyAudience,
  getReadingLanguages,
  getShareChannels,
} from "@/lib/dashboard/data";
import type { ShareChannel } from "@/lib/dashboard/types";

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = (await getDictionary()).dashboard.analytics;
  return { title, description };
}

const channelIcons: Record<ShareChannel, LucideIcon> = {
  whatsapp: MessageCircle,
  copy: Link2,
  email: Mail,
  native: Share2,
};

export default async function AnalyticsPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const copy = dict.dashboard;
  const number = new Intl.NumberFormat(locale);
  const month = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" });

  const kpis = getKpis();
  const channels = getShareChannels();
  const channelTotal = channels.reduce((total, item) => total + item.count, 0);
  const countries = getCountries();
  const countryMax = countries[0]?.visitors ?? 1;
  const languages = getReadingLanguages();
  const orders = getDashboardBooks().reduce((total, book) => total + book.orders, 0);
  const articles = getDashboardArticles()
    .filter((article) => article.status === "published")
    .sort((a, b) => b.views - a.views);

  const summary = [
    {
      icon: Clock,
      label: copy.analytics.avgRead,
      value: fill(copy.analytics.minutes, { count: kpis.avgReadMinutes.toLocaleString(locale) }),
    },
    { icon: Repeat, label: copy.analytics.returning, value: `${kpis.returningPercent}%` },
    { icon: Share2, label: copy.common.shares, value: number.format(channelTotal) },
    { icon: ShoppingBag, label: copy.analytics.bookOrders, value: number.format(orders) },
  ];

  return (
    <>
      <DashboardPageHeader title={copy.analytics.title} description={copy.analytics.description} />

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-black/5"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-tint text-brand">
              <item.icon aria-hidden className="size-5" />
            </span>
            <div>
              <p className="text-xs text-black/50">{item.label}</p>
              <p className="font-heading text-2xl font-semibold tabular-nums">{item.value}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <Card title={copy.analytics.viewsTitle} description={copy.common.last12Months}>
          <BarChart
            locale={locale}
            label={copy.analytics.viewsTitle}
            data={getMonthlyAudience().map((point) => ({
              label: month.format(point.month),
              value: point.views,
            }))}
          />
        </Card>

        <Card title={copy.analytics.sharesTitle}>
          <ul className="space-y-4">
            {channels.map((item) => {
              const Icon = channelIcons[item.channel];
              const percent = Math.round((item.count / channelTotal) * 100);
              return (
                <li key={item.channel}>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="grid size-8 place-items-center rounded-lg bg-mist text-black/60">
                      <Icon aria-hidden className="size-4" />
                    </span>
                    <span className="font-medium">{copy.analytics.channels[item.channel]}</span>
                    <span className="ml-auto tabular-nums">{number.format(item.count)}</span>
                    <span className="w-10 text-right text-xs text-black/45 tabular-nums">
                      {percent}%
                    </span>
                  </div>
                  <div className="mt-2 ml-11 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card title={copy.analytics.countriesTitle} description={copy.common.last12Months}>
          <ul className="space-y-3">
            {countries.map((country) => (
              <li
                key={country.code}
                className="grid grid-cols-[2.25rem_minmax(0,1fr)_4.5rem] items-center gap-3 text-sm"
              >
                <span className="rounded-md bg-mist py-1 text-center text-xs font-semibold text-black/55">
                  {country.code}
                </span>
                <div>
                  <p className="font-medium">{country.name[locale]}</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                    <div
                      className={
                        country.code === "CM"
                          ? "h-full rounded-full bg-brand"
                          : "h-full rounded-full bg-brand-soft"
                      }
                      style={{ width: `${(country.visitors / countryMax) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-right tabular-nums">{number.format(country.visitors)}</span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="grid gap-4">
          <Card title={copy.analytics.languagesTitle}>
            <div className="flex h-3 overflow-hidden rounded-full">
              <span className="bg-brand" style={{ width: `${languages.fr}%` }} />
              <span className="bg-brand-soft" style={{ width: `${languages.en}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {(
                [
                  ["fr", "bg-brand"],
                  ["en", "bg-brand-soft"],
                ] as const
              ).map(([lang, color]) => (
                <div key={lang} className="rounded-xl bg-mist p-3">
                  <p className="flex items-center gap-2 text-xs text-black/55">
                    <span aria-hidden className={`size-2 rounded-full ${color}`} />
                    {copy.editor.languages[lang]}
                  </p>
                  <p className="mt-1 font-heading text-2xl font-semibold tabular-nums">
                    {languages[lang]}%
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card title={copy.analytics.contentTitle} bodyClassName="px-0 pb-2 pt-3">
            <ul>
              {articles.map((article) => {
                const readRate = Math.round((article.reads / article.views) * 100);
                return (
                  <li key={article.id} className="border-t border-black/5 first:border-0">
                    <Link
                      href={localizePath(locale, `/dashboard/articles/${article.id}`)}
                      className="flex items-center gap-3 px-5 py-2.5 hover:bg-mist/60"
                    >
                      <ContentThumb cover={article.cover} kind="article" className="size-8" />
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-1 text-sm font-medium">
                          {article.title[locale]}
                        </span>
                        <span className="text-xs text-black/45">
                          {number.format(article.views)} {copy.common.views.toLowerCase()} ·{" "}
                          {readRate}% {copy.common.reads.toLowerCase()} ·{" "}
                          {number.format(article.shares)} {copy.common.shares.toLowerCase()}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

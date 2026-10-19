import {
  Clock,
  Link2,
  Mail,
  MessageCircle,
  Share2,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BreakdownCard, type BreakdownRow } from "@/components/dashboard/breakdown-card";
import { BarChart } from "@/components/dashboard/charts";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-shell";
import { Card, ContentThumb, fill } from "@/components/dashboard/ui";
import { VisitorMap } from "@/components/dashboard/visitor-map";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";
import {
  getCities,
  getCountries,
  getDashboardArticles,
  getDeviceStats,
  getKpis,
  getMonthlyAudience,
  getPageStats,
  getReadingLanguages,
  getReferrers,
  getRegions,
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

  const [
    kpis,
    channels,
    countries,
    cities,
    regions,
    languages,
    allArticles,
    pages,
    devices,
    referrers,
    audience,
  ] = await Promise.all([
    getKpis(),
    getShareChannels(),
    getCountries(),
    getCities(),
    getRegions(),
    getReadingLanguages(),
    getDashboardArticles(),
    getPageStats(),
    getDeviceStats(),
    getReferrers(),
    getMonthlyAudience(),
  ]);
  const channelTotal = channels.reduce((total, item) => total + item.count, 0);
  const countryNames = new Map(countries.map((country) => [country.code, country.name[locale]]));
  const articles = allArticles
    .filter((article) => article.status === "published")
    .sort((a, b) => b.views - a.views);

  const a = copy.analytics;
  const pageNames: Record<string, string> = a.pageNames;
  const articleTitles = new Map(articles.map((article) => [article.id, article.title[locale]]));
  const pageRow = ({ path, visitors }: { path: string; visitors: number }): BreakdownRow => {
    const slug = path.startsWith("/articles/") ? path.slice("/articles/".length) : null;
    return {
      label: (slug && articleTitles.get(slug)) ?? pageNames[path] ?? path,
      sub: path,
      value: visitors,
      icon: path.includes("#") ? "section" : "page",
    };
  };
  const countryRows = countries.map((country) => ({
    label: country.name[locale],
    badge: country.code,
    value: country.visitors,
  }));
  const cityRows = cities.map((city) => ({
    label: city.name,
    sub: countryNames.get(city.country),
    badge: city.country,
    value: city.visitors,
  }));

  const summary = [
    {
      icon: Clock,
      label: copy.analytics.avgRead,
      value: fill(copy.analytics.minutes, { count: kpis.avgReadMinutes.toLocaleString(locale) }),
    },
    { icon: Users, label: copy.analytics.visits, value: number.format(kpis.visits) },
    { icon: Share2, label: copy.common.shares, value: number.format(channelTotal) },
    { icon: ShoppingBag, label: copy.analytics.bookOrders, value: number.format(kpis.bookOrders) },
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

      <Card
        className="mt-4"
        title={a.mapTitle}
        description={a.mapDescription}
        bodyClassName="px-5 pb-5 pt-4"
      >
        <VisitorMap
          locale={locale}
          countries={countries.map((country) => ({
            code: country.code,
            name: country.name[locale],
            visitors: country.visitors,
            lat: country.lat,
            lng: country.lng,
            topCity: cities.find((city) => city.country === country.code)?.name,
          }))}
          articleTitles={Object.fromEntries(
            allArticles.map((article) => [article.id, article.title[locale] || article.title.en]),
          )}
          pageNames={pageNames}
          tabs={[
            { key: "countries", label: a.tabs.countries, rows: countryRows },
            { key: "cities", label: a.tabs.cities, rows: cityRows },
            {
              key: "sources",
              label: a.tabs.sources,
              rows: referrers.map((item) => ({
                label: a.referrers[item.source],
                value: item.visitors,
              })),
            },
          ]}
          copy={{
            readingNow: a.readingNow,
            visitors: a.visitors,
            ofVisitors: a.ofVisitors,
            topCity: a.topCity,
            live: a.live,
            liveEmpty: a.liveEmpty,
            liveEvent: a.liveEvent,
            justNow: a.justNow,
            countries: a.tabs.countries,
            empty: a.mapEmpty,
            liveEventUnknown: a.liveEventUnknown,
          }}
        />
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <Card title={copy.analytics.viewsTitle} description={copy.common.last12Months}>
          <BarChart
            locale={locale}
            label={copy.analytics.viewsTitle}
            data={audience.map((point) => ({
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

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BreakdownCard
          title={a.tabs.pages}
          locale={locale}
          valueLabel={a.visitors}
          tabs={(["top", "entered", "exited"] as const).map((key) => ({
            key,
            label: a.tabs[key],
            rows: pages[key].map(pageRow),
          }))}
        />
        <BreakdownCard
          title={a.tabs.sources}
          locale={locale}
          valueLabel={a.visitors}
          showPercent
          tabs={[
            {
              key: "referrer",
              label: a.tabs.referrer,
              rows: referrers.map((item) => ({
                label: a.referrers[item.source],
                value: item.visitors,
                icon: item.source,
              })),
            },
            {
              key: "shares",
              label: a.tabs.shares,
              rows: channels.map((item) => ({
                label: a.channels[item.channel],
                value: item.count,
                icon: item.channel,
              })),
            },
          ]}
        />
        <BreakdownCard
          title={a.tabs.locations}
          locale={locale}
          valueLabel={a.visitors}
          showPercent
          tabs={[
            { key: "countries", label: a.tabs.countries, rows: countryRows },
            {
              key: "regions",
              label: a.tabs.regions,
              rows: regions.map((region) => ({
                label: region.name[locale],
                sub: countryNames.get(region.country),
                badge: region.country,
                value: region.visitors,
              })),
            },
            { key: "cities", label: a.tabs.cities, rows: cityRows },
          ]}
        />
        <BreakdownCard
          title={a.tabs.devices}
          locale={locale}
          valueLabel={a.visitors}
          showPercent
          tabs={[
            {
              key: "browsers",
              label: a.tabs.browsers,
              rows: devices.browsers.map((item) => ({
                label: item.name,
                value: item.visitors,
                icon: "browser",
              })),
            },
            {
              key: "os",
              label: a.tabs.os,
              rows: devices.os.map((item) => ({
                label: item.name,
                value: item.visitors,
                icon: "os",
              })),
            },
            {
              key: "devices",
              label: a.tabs.deviceTypes,
              rows: devices.devices.map((item) => ({
                label: a.deviceTypes[item.name],
                value: item.visitors,
                icon: item.name,
              })),
            },
          ]}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
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
    </>
  );
}

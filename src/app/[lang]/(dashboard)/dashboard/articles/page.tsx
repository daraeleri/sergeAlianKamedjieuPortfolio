import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { ContentManager } from "@/components/dashboard/content-manager";
import { DashboardButtonLink, DashboardPageHeader } from "@/components/dashboard/dashboard-shell";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";
import { getDashboardArticles } from "@/lib/dashboard/data";
import { articleReadiness } from "@/lib/dashboard/readiness";

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = (await getDictionary()).dashboard.articles;
  return { title, description };
}

export default async function DashboardArticlesPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const copy = dict.dashboard;
  const date = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  const rows = getDashboardArticles().map((article) => ({
    id: article.id,
    href: localizePath(locale, `/dashboard/articles/${article.id}`),
    title: article.title[locale] || article.title.en || article.title.fr,
    subtitle: article.category[locale] || article.category.en,
    status: article.status,
    cover: article.cover,
    percent: articleReadiness(article).percent,
    views: article.views,
    second: article.shares,
    updatedLabel: date.format(new Date(article.updatedAt)),
  }));

  return (
    <>
      <DashboardPageHeader
        title={copy.articles.title}
        description={copy.articles.description}
        actions={
          <DashboardButtonLink href={localizePath(locale, "/dashboard/articles/new")}>
            <Plus aria-hidden className="size-4" />
            {copy.common.newArticle}
          </DashboardButtonLink>
        }
      />
      <ContentManager rows={rows} kind="article" copy={copy} locale={locale} />
    </>
  );
}

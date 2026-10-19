import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/site/article-card";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { pageMetadata, sectionHref } from "@/i18n/routing";
import { articleAvatar, getArticles } from "@/lib/articles";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return pageMetadata({
    locale,
    pathname: "/articles",
    title: dict.articles.pageTitle,
    description: dict.articles.pageIntro,
  });
}

/** Every article, newest first, as image cards (the home page shows the six newest). */
export default async function ArticlesPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const copy = dict.articles;
  const articles = getArticles(locale, copy);

  return (
    <div className="bg-white text-ink">
      <div className="mx-auto max-w-6xl px-5 pt-32 pb-20 sm:px-8 sm:pt-36 sm:pb-24">
        <Link
          href={sectionHref(locale, "articles")}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-black/55 transition-colors hover:text-brand-strong"
        >
          <ArrowLeft
            aria-hidden
            className="size-4 transition-transform group-hover:-translate-x-0.5"
          />
          {copy.backHome}
        </Link>

        <header className="mt-8 flex animate-fade-up flex-col gap-6 border-b border-black/10 pb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-mist px-3.5 py-1.5 text-xs font-medium text-black/65">
              <span aria-hidden className="size-1.5 rounded-full bg-brand" />
              {copy.label}
            </p>
            <h1 className="mt-5 font-heading text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl">
              {copy.pageTitle}
            </h1>
            <p className="mt-5 leading-relaxed text-black/60">{copy.pageIntro}</p>
          </div>
          <p className="shrink-0 text-sm font-medium text-black/50">
            {copy.count.replace("{count}", String(articles.length))}
          </p>
        </header>

        <ul
          aria-label={copy.listLabel}
          className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
        >
          {articles.map((article, i) => (
            <li
              key={article.slug}
              className="flex animate-fade-up"
              style={{ animationDelay: `${120 + i * 60}ms` }}
            >
              <ArticleCard article={article} author={copy.author} avatar={articleAvatar} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

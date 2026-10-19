import { ArrowLeft, ArrowRight, CalendarDays, Clock } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/site/article/article-body";
import { ArticleShare } from "@/components/site/article/article-share";
import { ReadTracker } from "@/components/site/article/read-tracker";
import { ArticleToc } from "@/components/site/article/article-toc";
import { ArticleCard, articleThemes } from "@/components/site/article-card";
import { siteConfig } from "@/config/site";
import { readingMinutes } from "@/content/article-bodies";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath, pageMetadata, sectionHref } from "@/i18n/routing";
import { articleAvatar, articleHref } from "@/lib/articles";
import { getArticleBody, getArticles } from "@/lib/content";
import { articleSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";
import { defaultLocale } from "@/i18n/config";
import { cn } from "@/lib/utils";

type Props = PageProps<"/[lang]/articles/[slug]">;

export async function generateStaticParams() {
  // The [lang] layout provides the locales; every locale has the same article slugs.
  return (await getArticles(defaultLocale)).map(({ slug }) => ({ slug }));
}

/** The article and its body for the current locale, or a 404. */
async function loadArticle(params: Props["params"]) {
  const [{ slug }, locale, dict] = await Promise.all([params, getLocale(), getDictionary()]);
  const [articles, body] = await Promise.all([getArticles(locale), getArticleBody(locale, slug)]);
  const article = articles.find((item) => item.slug === slug);
  if (!article || !body) notFound();
  return { locale, dict, articles, article, body };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, article } = await loadArticle(params);
  return pageMetadata({
    locale,
    pathname: `/articles/${article.slug}`,
    title: article.title,
    description: article.excerpt,
    article: { publishedTime: article.date, section: article.category },
  });
}

/**
 * Article page (golden-gab and MT Consulting layout, Medium-style reading): reading
 * progress bar, header with category, title, lead, byline and share buttons, a wide
 * cover, then the article with a sticky sidebar (details, table of contents, invitation),
 * the author box and other articles.
 */
export default function ArticlePage({ params }: Props) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <Article params={params} />
    </Suspense>
  );
}

/** Placeholder while the article reads its URL (instant navigation). */
function ArticleSkeleton() {
  return (
    <div aria-hidden className="mx-auto max-w-6xl animate-pulse px-5 pt-32 pb-24 sm:px-8 sm:pt-36">
      <div className="h-4 w-24 rounded bg-black/5" />
      <div className="mt-8 h-12 max-w-2xl rounded-lg bg-black/5" />
      <div className="mt-4 h-6 max-w-xl rounded bg-black/5" />
      <div className="mt-10 aspect-[21/9] rounded-[2rem] bg-black/5" />
    </div>
  );
}

async function Article({ params }: { params: Props["params"] }) {
  const { locale, dict, articles, article, body } = await loadArticle(params);
  const copy = dict.articles;
  const detail = copy.detail;
  const minutes = detail.minRead.replace("{count}", String(readingMinutes(body)));
  const toc = body.flatMap((block) =>
    block.type === "h2" ? [{ id: block.id, text: block.text }] : [],
  );
  const related = articles.filter((item) => item.slug !== article.slug).slice(0, 3);
  const url = `${siteConfig.url}${articleHref(locale, article.slug)}`;
  const theme = articleThemes[article.theme];
  const ThemeIcon = theme.icon;

  return (
    <div className="bg-white text-ink">
      <JsonLd data={articleSchema(locale, dict, article)} />
      <div aria-hidden className="reading-progress fixed inset-x-0 top-0 z-[60] h-1 bg-brand" />

      <article className="mx-auto max-w-6xl px-5 pt-32 sm:px-8 sm:pt-36">
        {/* Header */}
        <header className="max-w-3xl animate-fade-up">
          <Link
            href={localizePath(locale, "/articles")}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-black/55 transition-colors hover:text-brand-strong"
          >
            <ArrowLeft
              aria-hidden
              className="size-4 transition-transform group-hover:-translate-x-0.5"
            />
            {detail.backToArticles}
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold text-brand-strong">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-black/50">
              <Clock aria-hidden className="size-3.5" />
              {minutes}
            </span>
          </div>

          <h1 className="mt-5 font-heading text-[2.2rem] leading-[1.06] font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
            {article.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-black/60 sm:text-xl">{article.excerpt}</p>
        </header>

        {/* Byline */}
        <div className="mt-8 flex animate-fade-up flex-wrap items-center justify-between gap-5 border-y border-black/10 py-4 [animation-delay:100ms]">
          <div className="flex items-center gap-3">
            <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-brand-tint">
              <Image
                src={articleAvatar}
                alt=""
                fill
                sizes="44px"
                className="origin-[50%_8%] scale-[2.2] object-cover object-top"
              />
            </span>
            <div className="text-sm leading-tight">
              <p className="font-semibold">{copy.author}</p>
              <p className="mt-1 text-black/50">
                {detail.published} <time dateTime={article.date}>{article.dateLabel}</time>
              </p>
            </div>
          </div>
          <ArticleShare url={url} title={article.title} labels={detail} />
        </div>

        {/* Cover */}
        <div
          className={cn(
            "relative isolate mt-10 aspect-[16/10] animate-fade-up overflow-hidden rounded-[1.75rem] text-white [animation-delay:200ms] sm:aspect-[21/9] sm:rounded-[2rem]",
            !article.image && theme.className,
          )}
        >
          {article.image ? (
            <Image
              src={article.image}
              alt=""
              fill
              preload
              sizes="(min-width: 1152px) 1088px, 94vw"
              className="object-cover"
            />
          ) : (
            <>
              <svg
                aria-hidden
                viewBox="0 0 1200 500"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 -z-10 size-full opacity-20"
              >
                <path
                  d="M-60 420 C 220 380 360 140 560 170 C 740 196 660 380 510 340 C 360 300 520 70 820 80 C 1020 88 1120 220 1280 140"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="60"
                  strokeLinecap="round"
                />
              </svg>
              <ThemeIcon
                aria-hidden
                strokeWidth={1}
                className="absolute top-1/2 left-1/2 size-28 -translate-x-1/2 -translate-y-1/2 opacity-40 sm:size-40"
              />
            </>
          )}
        </div>

        {/* Article and sidebar */}
        <div className="mt-12 grid gap-12 pb-20 sm:mt-16 sm:pb-24 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
          <div className="min-w-0">
            <ArticleToc items={toc} label={detail.toc} variant="collapsible" />
            <ArticleBody blocks={body} />
            <ReadTracker articleId={article.slug} />

            {/* Category and share, after reading */}
            <div className="mt-14 flex max-w-[42rem] flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-6">
              <span className="rounded-full bg-mist px-3 py-1 text-sm font-medium text-black/65">
                # {article.category}
              </span>
              <ArticleShare url={url} title={article.title} labels={detail} />
            </div>

            {/* Author */}
            <aside
              aria-label={detail.aboutAuthor}
              className="mt-10 flex max-w-[42rem] flex-col gap-5 rounded-2xl bg-mist p-6 sm:flex-row sm:p-7"
            >
              <span className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-brand-tint">
                <Image
                  src={articleAvatar}
                  alt=""
                  fill
                  sizes="80px"
                  className="origin-[50%_10%] scale-[1.6] object-cover object-top"
                />
              </span>
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-black/45 uppercase">
                  {detail.aboutAuthor}
                </p>
                <p className="mt-2 font-heading text-lg font-semibold tracking-tight">
                  {siteConfig.name}
                </p>
                <p className="text-sm text-brand-strong">{detail.authorRole}</p>
                <p className="mt-3 text-sm leading-relaxed text-black/60">{detail.authorBio}</p>
                <Link
                  href={sectionHref(locale, "about")}
                  className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium underline decoration-black/15 underline-offset-4 hover:text-brand-strong hover:decoration-brand"
                >
                  {detail.authorLink}
                  <ArrowRight
                    aria-hidden
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </aside>
          </div>

          {/* Sticky sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-8">
              <dl className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <CalendarDays aria-hidden className="size-4 text-brand" />
                  <div>
                    <dt className="sr-only">{detail.published}</dt>
                    <dd>
                      <time dateTime={article.date}>{article.dateLabel}</time>
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock aria-hidden className="size-4 text-brand" />
                  <dd>{minutes}</dd>
                </div>
              </dl>

              <ArticleToc items={toc} label={detail.toc} variant="sidebar" />

              <div className="relative isolate overflow-hidden rounded-2xl bg-brand p-5 text-white">
                <svg
                  aria-hidden
                  viewBox="0 0 400 400"
                  className="absolute -right-16 -bottom-16 -z-10 size-48 text-white/15"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="46"
                    strokeLinecap="round"
                    d="M40 330C80 220 170 250 210 170s-30-130 40-130 120 90 70 170"
                  />
                </svg>
                <p className="font-heading text-lg leading-snug font-semibold">
                  {detail.inviteTitle}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{detail.inviteText}</p>
                <Link
                  href={sectionHref(locale, "contact")}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-brand-tint"
                >
                  {detail.inviteCta}
                  <ArrowRight aria-hidden className="size-3.5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {/* Other articles */}
      {related.length ? (
        <section aria-labelledby="related-heading" className="bg-mist py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-black/50">{detail.continueLabel}</p>
                <h2
                  id="related-heading"
                  className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
                >
                  {detail.related}
                </h2>
              </div>
              <Link
                href={localizePath(locale, "/articles")}
                className="group inline-flex items-center gap-1.5 text-sm font-medium hover:text-brand-strong"
              >
                {copy.seeAll}
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug} className="flex">
                  <ArticleCard
                    article={item}
                    author={copy.author}
                    avatar={articleAvatar}
                    href={articleHref(locale, item.slug)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}

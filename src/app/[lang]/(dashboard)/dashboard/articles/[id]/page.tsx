import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { EditorSkeleton } from "@/components/dashboard/ui";
import { ArticleEditor } from "@/components/dashboard/editor/article-editor";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";
import { getDashboardArticle, getDashboardArticles } from "@/lib/dashboard/data";

type Props = PageProps<"/[lang]/dashboard/articles/[id]">;

export async function generateStaticParams() {
  return getDashboardArticles().map((article) => ({ id: article.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ id }, locale, dict] = await Promise.all([params, getLocale(), getDictionary()]);
  const article = getDashboardArticle(id);
  return {
    title: article?.title[locale] || article?.title.en || dict.dashboard.editor.editArticle,
  };
}

export default function EditArticlePage({ params }: Props) {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <ArticleEditorLoader params={params} />
    </Suspense>
  );
}

/** Reads the URL, so it renders inside the Suspense boundary above (instant navigation). */
async function ArticleEditorLoader({ params }: { params: Props["params"] }) {
  const [{ id }, locale, dict] = await Promise.all([params, getLocale(), getDictionary()]);
  const article = getDashboardArticle(id);
  if (!article) notFound();

  return (
    <ArticleEditor
      id={article.id}
      locale={locale}
      copy={dict.dashboard}
      backHref={localizePath(locale, "/dashboard/articles")}
      updatedAt={article.updatedAt}
      initial={{
        status: article.status,
        category: article.category,
        title: article.title,
        excerpt: article.excerpt,
        cover: article.cover,
        body: article.body,
      }}
    />
  );
}

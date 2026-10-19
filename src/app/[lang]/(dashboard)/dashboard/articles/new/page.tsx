import type { Metadata } from "next";
import { ArticleEditor } from "@/components/dashboard/editor/article-editor";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";
import { getActiveSubscriberCount } from "@/lib/dashboard/data";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).dashboard.editor.newArticle };
}

export default async function NewArticlePage() {
  const [locale, dict, subscribers] = await Promise.all([
    getLocale(),
    getDictionary(),
    getActiveSubscriberCount(),
  ]);
  return (
    <ArticleEditor
      id="new"
      subscribers={subscribers}
      locale={locale}
      copy={dict.dashboard}
      backHref={localizePath(locale, "/dashboard/articles")}
      initial={{
        status: "idea",
        category: { en: "", fr: "" },
        title: { en: "", fr: "" },
        excerpt: { en: "", fr: "" },
        body: { en: [{ type: "p", text: "" }], fr: [{ type: "p", text: "" }] },
      }}
    />
  );
}

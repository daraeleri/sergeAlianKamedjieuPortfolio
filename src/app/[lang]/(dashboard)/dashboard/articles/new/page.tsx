import type { Metadata } from "next";
import { ArticleEditor } from "@/components/dashboard/editor/article-editor";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).dashboard.editor.newArticle };
}

export default async function NewArticlePage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return (
    <ArticleEditor
      id="new"
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

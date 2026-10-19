import type { Metadata } from "next";
import { BookEditor } from "@/components/dashboard/editor/book-editor";
import { siteConfig } from "@/config/site";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";
import { getActiveSubscriberCount } from "@/lib/dashboard/data";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).dashboard.editor.newBook };
}

export default async function NewBookPage() {
  const [locale, dict, subscribers] = await Promise.all([
    getLocale(),
    getDictionary(),
    getActiveSubscriberCount(),
  ]);
  return (
    <BookEditor
      id="new"
      subscribers={subscribers}
      locale={locale}
      copy={dict.dashboard}
      backHref={localizePath(locale, "/dashboard/books")}
      author={siteConfig.name}
      orderLabel={dict.books.orderShort}
      initial={{
        status: "idea",
        title: "",
        description: { en: "", fr: "" },
        tags: { en: [], fr: [] },
      }}
    />
  );
}

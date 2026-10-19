import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { EditorSkeleton } from "@/components/dashboard/ui";
import { BookEditor } from "@/components/dashboard/editor/book-editor";
import { siteConfig } from "@/config/site";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";
import { getDashboardBook, getDashboardBooks } from "@/lib/dashboard/data";

type Props = PageProps<"/[lang]/dashboard/books/[id]">;

export async function generateStaticParams() {
  return getDashboardBooks().map((book) => ({ id: book.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ id }, dict] = await Promise.all([params, getDictionary()]);
  return { title: getDashboardBook(id)?.title ?? dict.dashboard.editor.editBook };
}

export default function EditBookPage({ params }: Props) {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <BookEditorLoader params={params} />
    </Suspense>
  );
}

/** Reads the URL, so it renders inside the Suspense boundary above (instant navigation). */
async function BookEditorLoader({ params }: { params: Props["params"] }) {
  const [{ id }, locale, dict] = await Promise.all([params, getLocale(), getDictionary()]);
  const book = getDashboardBook(id);
  if (!book) notFound();

  return (
    <BookEditor
      id={book.id}
      locale={locale}
      copy={dict.dashboard}
      backHref={localizePath(locale, "/dashboard/books")}
      author={siteConfig.name}
      orderLabel={dict.books.orderShort}
      updatedAt={book.updatedAt}
      initial={{
        status: book.status,
        title: book.title,
        description: book.description,
        tags: book.tags,
        cover: book.cover,
        pages: book.pages,
        year: book.year,
      }}
    />
  );
}

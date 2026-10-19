import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { ContentManager } from "@/components/dashboard/content-manager";
import { DashboardButtonLink, DashboardPageHeader } from "@/components/dashboard/dashboard-shell";
import { fill } from "@/components/dashboard/ui";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";
import { getDashboardBooks } from "@/lib/dashboard/data";
import { bookReadiness } from "@/lib/dashboard/readiness";

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = (await getDictionary()).dashboard.books;
  return { title, description };
}

export default async function DashboardBooksPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const copy = dict.dashboard;
  const date = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  const rows = (await getDashboardBooks()).map((book) => ({
    id: book.id,
    href: localizePath(locale, `/dashboard/books/${book.id}`),
    title: book.title,
    subtitle: [book.year, book.pages ? fill(copy.books.pages, { count: book.pages }) : null]
      .filter(Boolean)
      .join(" · "),
    status: book.status,
    cover: book.cover,
    percent: bookReadiness(book).percent,
    views: book.views,
    second: book.orders,
    updatedLabel: date.format(new Date(book.updatedAt)),
  }));

  return (
    <>
      <DashboardPageHeader
        title={copy.books.title}
        description={copy.books.description}
        actions={
          <DashboardButtonLink href={localizePath(locale, "/dashboard/books/new")}>
            <Plus aria-hidden className="size-4" />
            {copy.common.newBook}
          </DashboardButtonLink>
        }
      />
      <ContentManager rows={rows} kind="book" copy={copy} locale={locale} />
    </>
  );
}

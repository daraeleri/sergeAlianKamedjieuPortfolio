import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";

export default async function NotFound() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold">{dict.notFound.title}</h1>
      <p className="text-muted">{dict.notFound.description}</p>
      <Link href={localizePath(locale, "/")} className="underline underline-offset-4">
        {dict.notFound.backHome}
      </Link>
    </main>
  );
}

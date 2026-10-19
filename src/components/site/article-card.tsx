import {
  BookOpen,
  Flame,
  Globe,
  GraduationCap,
  HandHeart,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ArticleCardData, ArticleTheme } from "@/lib/articles";
import { cn } from "@/lib/utils";

/** Background and icon of the designed fallback, per theme (until articles have photos). */
export const articleThemes: Record<ArticleTheme, { icon: LucideIcon; className: string }> = {
  spirit: {
    icon: Flame,
    className:
      "bg-brand bg-[radial-gradient(circle_at_70%_20%,rgb(255_255_255/0.35),transparent_55%)]",
  },
  leadership: {
    icon: Users,
    className:
      "bg-ink bg-[radial-gradient(circle_at_80%_10%,rgb(65_105_225/0.75),transparent_60%)]",
  },
  scripture: {
    icon: BookOpen,
    className:
      "bg-[#dfe6ff] bg-[radial-gradient(circle_at_30%_15%,rgb(255_255_255/0.9),transparent_55%)] text-brand",
  },
  mission: {
    icon: Globe,
    className: "bg-gradient-to-br from-brand-strong via-brand to-brand-soft",
  },
  life: {
    icon: HandHeart,
    className: "bg-gradient-to-b from-brand-soft to-brand-tint text-brand-strong",
  },
  training: {
    icon: GraduationCap,
    className: "bg-gradient-to-br from-ink via-[#13224d] to-brand",
  },
};

/**
 * One article: picture (or themed background) with a stepped white panel at the bottom
 * (category tab, title and excerpt, then an author and date strip). The whole card links
 * to the article: the title link is stretched over the card.
 */
export function ArticleCard({
  article,
  author,
  avatar,
  href,
}: {
  article: ArticleCardData;
  /** Article page. */
  href: Route;
  author: string;
  /** Author photo for the byline. */
  avatar: string;
}) {
  const theme = articleThemes[article.theme];
  const Icon = theme.icon;

  return (
    <article
      className={cn(
        "group relative isolate flex min-h-[26rem] w-full flex-col justify-end overflow-hidden rounded-2xl p-3 text-white sm:min-h-[28rem] sm:p-4",
        !article.image && theme.className,
      )}
    >
      {article.image ? (
        <Image
          src={article.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="-z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <>
          <svg
            aria-hidden
            viewBox="0 0 400 400"
            className="absolute -top-16 -right-20 -z-10 size-80 opacity-15 transition-transform duration-700 ease-out group-hover:-rotate-6"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="46"
              strokeLinecap="round"
              d="M40 330C80 220 170 250 210 170s-30-130 40-130 120 90 70 170"
            />
          </svg>
          <Icon
            aria-hidden
            strokeWidth={1.25}
            className="absolute top-10 left-8 -z-10 size-20 opacity-30 transition-transform duration-700 ease-out group-hover:scale-110 sm:size-24"
          />
        </>
      )}

      {/* Stepped white panel: category tab, content, byline */}
      <div className="text-ink">
        <p className="inline-block rounded-t-xl bg-white px-3.5 pt-2.5 pb-1 text-xs font-medium text-brand-strong">
          {article.category}
        </p>
        <div className="rounded-xl rounded-tl-none rounded-bl-none bg-white px-4 pt-3 pb-4">
          <h3 className="font-heading text-lg leading-snug font-semibold tracking-tight text-balance">
            <Link
              href={href}
              className="outline-none after:absolute after:inset-0 after:z-10 after:rounded-2xl focus-visible:after:ring-4 focus-visible:after:ring-brand/40"
            >
              {article.title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-black/60">
            {article.excerpt}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-b-xl bg-white px-3 pt-1 pb-2.5 text-xs">
          <span className="relative size-7 shrink-0 overflow-hidden rounded-full bg-brand-tint ring-2 ring-white">
            <Image
              src={avatar}
              alt=""
              fill
              sizes="28px"
              className="origin-[50%_8%] scale-[2.2] object-cover object-top"
            />
          </span>
          <span className="font-medium whitespace-nowrap">{author}</span>
          <span aria-hidden className="text-black/30">
            ·
          </span>
          <time dateTime={article.date} className="whitespace-nowrap text-black/55">
            {article.dateLabel}
          </time>
        </div>
      </div>
    </article>
  );
}

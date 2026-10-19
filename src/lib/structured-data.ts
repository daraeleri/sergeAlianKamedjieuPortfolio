import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/routing";
import { articleAvatar, articleHref, type ArticleCardData } from "@/lib/articles";

/**
 * schema.org data for search engines (rendered with <JsonLd>): who the author is, the
 * website, and each article. Helps Google show the name, photo and article dates.
 */

const absolute = (path: string) => new URL(path, siteConfig.url).toString();
const personId = absolute("/#person");
const websiteId = absolute("/#website");

function person(locale: Locale, dict: Dictionary) {
  return {
    "@type": "Person",
    "@id": personId,
    name: siteConfig.name,
    url: absolute(localizePath(locale, "/")),
    image: absolute(articleAvatar),
    jobTitle: dict.articles.detail.authorRole,
    description: dict.site.description,
    email: `mailto:${siteConfig.contactEmail}`,
    worksFor: { "@type": "Organization", name: "JAFAN Ministries" },
    address: { "@type": "PostalAddress", addressLocality: "Bafoussam", addressCountry: "CM" },
  };
}

/** Home page: the author and the website. */
export function homeSchema(locale: Locale, dict: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      person(locale, dict),
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: absolute(localizePath(locale, "/")),
        name: siteConfig.name,
        description: dict.site.description,
        inLanguage: locale,
        publisher: { "@id": personId },
      },
    ],
  };
}

/** Article page: the post and its place in the site (breadcrumb). */
export function articleSchema(locale: Locale, dict: Dictionary, article: ArticleCardData) {
  const url = absolute(articleHref(locale, article.slug));
  // Inline (data:) covers can't be fetched by search engines; use the author photo then.
  const image =
    article.image && !article.image.startsWith("data:") ? absolute(article.image) : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: article.title,
        description: article.excerpt,
        datePublished: article.date,
        inLanguage: locale,
        articleSection: article.category,
        url,
        mainEntityOfPage: url,
        image: image ?? absolute(articleAvatar),
        author: person(locale, dict),
        publisher: { "@id": personId },
        isPartOf: { "@id": websiteId },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: dict.nav.home, path: localizePath(locale, "/") },
          { name: dict.articles.pageTitle, path: localizePath(locale, "/articles") },
          { name: article.title, path: articleHref(locale, article.slug) },
        ].map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: absolute(item.path),
        })),
      },
    ],
  };
}

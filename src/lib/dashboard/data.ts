import "server-only";
import { articleBodies } from "@/content/article-bodies";
import { articleMeta } from "@/content/articles";
import { bookCovers } from "@/content/books";
import en from "@/i18n/dictionaries/en.json";
import fr from "@/i18n/dictionaries/fr.json";
import type {
  ArticleDoc,
  Bilingual,
  BookDoc,
  City,
  Country,
  DeviceType,
  InboxMessage,
  Referrer,
  ShareChannel,
} from "./types";

/**
 * Dashboard data. SAMPLE DATA until the database is connected: published articles and
 * books come from the site's content files, and the drafts, engagement figures and
 * messages below are examples. Replace these functions with database queries; the pages
 * only depend on their return types.
 *
 * Articles without a photo use their themed design as cover, written "theme:<name>".
 */

/** Sample engagement for the published articles, by slug. */
const articleStats: Record<string, { views: number; reads: number; shares: number }> = {
  "plenitude-du-saint-esprit": { views: 4820, reads: 3110, shares: 412 },
  "leadership-serviteur": { views: 3960, reads: 2540, shares: 365 },
  "autorite-des-ecritures-aujourd-hui": { views: 3210, reads: 2080, shares: 248 },
  "de-bafoussam-aux-nations": { views: 2870, reads: 1730, shares: 301 },
  "foi-esperance-amour": { views: 2260, reads: 1490, shares: 187 },
  "former-des-leaders": { views: 1940, reads: 1180, shares: 142 },
};

const publishedArticles: ArticleDoc[] = en.articles.items.map((item) => {
  const frItem = fr.articles.items.find((other) => other.slug === item.slug) ?? item;
  const meta = articleMeta[item.slug];
  return {
    id: item.slug,
    status: "published",
    category: { en: item.category, fr: frItem.category },
    title: { en: item.title, fr: frItem.title },
    excerpt: { en: item.excerpt, fr: frItem.excerpt },
    cover: meta?.image ?? `theme:${meta?.theme ?? "spirit"}`,
    body: { en: articleBodies.en[item.slug] ?? [], fr: articleBodies.fr[item.slug] ?? [] },
    updatedAt: `${meta?.date ?? "2026-07-01"}T09:00:00Z`,
    ...(articleStats[item.slug] ?? { views: 0, reads: 0, shares: 0 }),
  };
});

/** Sample drafts at different stages, to show the publishing pipeline. */
const draftArticles: ArticleDoc[] = [
  {
    id: "priere-et-leadership",
    status: "review",
    category: { en: "Leadership", fr: "Leadership" },
    title: {
      en: "Prayer, the hidden strength of every leader",
      fr: "La prière, force cachée de tout leader",
    },
    excerpt: {
      en: "Why the most fruitful leaders in Scripture were first people of prayer, and how to build that habit.",
      fr: "Pourquoi les leaders les plus féconds de l’Écriture étaient d’abord des gens de prière, et comment en faire une habitude.",
    },
    cover: "theme:leadership",
    body: {
      en: [
        ...(articleBodies.en["leadership-serviteur"] ?? []),
        { type: "h2", id: "prayer", text: "Leading from the place of prayer" },
      ],
      fr: [],
    },
    updatedAt: "2026-10-17T16:20:00Z",
    views: 0,
    reads: 0,
    shares: 0,
  },
  {
    id: "nouvelle-generation-evangelistes",
    status: "draft",
    category: { en: "Mission", fr: "Mission" },
    title: {
      en: "Raising a new generation of evangelists",
      fr: "Former une nouvelle génération d’évangélistes",
    },
    excerpt: { en: "What the next generation needs from us to carry the Gospel further.", fr: "" },
    body: {
      en: [
        {
          type: "p",
          text: "Every generation must receive the Gospel and pass it on. The question is not whether young people will lead, but whether we will prepare them.",
        },
        { type: "h2", id: "call", text: "A call for every generation" },
        {
          type: "p",
          text: "From Timothy to the young leaders trained today at the JAFAN Academy, God has always raised up new voices.",
        },
      ],
      fr: [],
    },
    updatedAt: "2026-10-15T10:05:00Z",
    views: 0,
    reads: 0,
    shares: 0,
  },
  {
    id: "joseph-gestion-famine",
    status: "idea",
    category: { en: "Christian life", fr: "Vie chrétienne" },
    title: { en: "Joseph: stewardship in times of famine", fr: "" },
    excerpt: { en: "", fr: "" },
    body: { en: [], fr: [] },
    updatedAt: "2026-10-12T08:40:00Z",
    views: 0,
    reads: 0,
    shares: 0,
  },
  {
    id: "esprit-et-eglise-etude",
    status: "scheduled",
    category: { en: "Holy Spirit", fr: "Saint-Esprit" },
    title: {
      en: "The Holy Spirit and the Church: a study in Acts",
      fr: "Le Saint-Esprit et l’Église : une étude des Actes",
    },
    excerpt: {
      en: "A walk through the book of Acts to see how the Spirit formed, led and sent the first Church.",
      fr: "Un parcours du livre des Actes pour voir comment l’Esprit a formé, conduit et envoyé la première Église.",
    },
    cover: "theme:spirit",
    body: {
      en: articleBodies.en["plenitude-du-saint-esprit"] ?? [],
      fr: articleBodies.fr["plenitude-du-saint-esprit"] ?? [],
    },
    updatedAt: "2026-10-18T19:30:00Z",
    views: 0,
    reads: 0,
    shares: 0,
  },
];

const bookStats: Record<string, { views: number; orders: number; pages: number; year: number }> = {
  "le-saint-esprit-et-l-eglise": { views: 1840, orders: 46, pages: 184, year: 2018 },
  "vers-une-plus-grande-manifestation-de-la-puissance-de-dieu": {
    views: 1520,
    orders: 38,
    pages: 212,
    year: 2020,
  },
  "le-leadership-et-la-puissance-du-saint-esprit": {
    views: 1310,
    orders: 29,
    pages: 196,
    year: 2022,
  },
  "l-autorite-des-ecritures": { views: 980, orders: 21, pages: 168, year: 2024 },
};

const publishedBooks: BookDoc[] = en.books.items.map((item) => {
  const frItem = fr.books.items.find((other) => other.slug === item.slug) ?? item;
  const stats = bookStats[item.slug] ?? { views: 0, orders: 0, pages: 0, year: 2024 };
  return {
    id: item.slug,
    status: "published",
    title: item.title,
    description: { en: item.description, fr: frItem.description },
    tags: item.tags,
    cover: bookCovers[item.slug],
    pages: stats.pages,
    year: stats.year,
    updatedAt: `${stats.year}-06-01T09:00:00Z`,
    views: stats.views,
    orders: stats.orders,
  };
});

const draftBooks: BookDoc[] = [
  {
    id: "le-ministere-de-la-reconciliation",
    status: "draft",
    title: "Le ministère de la réconciliation",
    description: {
      en: "",
      fr: "Comment l’Église peut devenir un instrument de paix et de réconciliation dans les familles et les nations.",
    },
    tags: ["Église"],
    pages: 150,
    updatedAt: "2026-10-16T14:00:00Z",
    views: 0,
    orders: 0,
  },
];

export function getDashboardArticles(): ArticleDoc[] {
  return [...draftArticles, ...publishedArticles].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}

export function getDashboardArticle(id: string) {
  return getDashboardArticles().find((article) => article.id === id);
}

export function getDashboardBooks(): BookDoc[] {
  return [...draftBooks, ...publishedBooks];
}

export function getDashboardBook(id: string) {
  return getDashboardBooks().find((book) => book.id === id);
}

/** Monthly views and article reads for the last 12 months, oldest first (sample). */
export function getMonthlyAudience() {
  const views = [1180, 1340, 1290, 1620, 1810, 1750, 2140, 2380, 2290, 2710, 3020, 3460];
  const reads = [620, 710, 690, 880, 1010, 960, 1230, 1390, 1310, 1600, 1820, 2080];
  // The last value is the current month (October 2026).
  const end = new Date(Date.UTC(2026, 9, 1));
  return views.map((value, i) => ({
    month: new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - (views.length - 1 - i), 1)),
    views: value,
    reads: reads[i],
  }));
}

export function getShareChannels(): { channel: ShareChannel; count: number }[] {
  return [
    { channel: "whatsapp", count: 892 },
    { channel: "copy", count: 431 },
    { channel: "native", count: 214 },
    { channel: "email", count: 118 },
  ];
}

/** Visitors by country for the last 12 months, with a map position (sample). */
export function getCountries(): Country[] {
  return [
    { code: "CM", name: { en: "Cameroon", fr: "Cameroun" }, visitors: 9240, lat: 5.7, lng: 12.4 },
    { code: "FR", name: { en: "France", fr: "France" }, visitors: 2310, lat: 46.6, lng: 2.4 },
    { code: "CA", name: { en: "Canada", fr: "Canada" }, visitors: 1580, lat: 52, lng: -100 },
    {
      code: "CI",
      name: { en: "Côte d’Ivoire", fr: "Côte d’Ivoire" },
      visitors: 1120,
      lat: 7.6,
      lng: -5.5,
    },
    {
      code: "US",
      name: { en: "United States", fr: "États-Unis" },
      visitors: 940,
      lat: 38.5,
      lng: -97,
    },
    { code: "GA", name: { en: "Gabon", fr: "Gabon" }, visitors: 610, lat: -0.8, lng: 11.6 },
    { code: "BE", name: { en: "Belgium", fr: "Belgique" }, visitors: 470, lat: 50.6, lng: 4.7 },
    { code: "NG", name: { en: "Nigeria", fr: "Nigeria" }, visitors: 380, lat: 9.1, lng: 8.2 },
    { code: "CD", name: { en: "DR Congo", fr: "RD Congo" }, visitors: 340, lat: -2.9, lng: 23.6 },
    { code: "SN", name: { en: "Senegal", fr: "Sénégal" }, visitors: 260, lat: 14.5, lng: -14.4 },
    { code: "CH", name: { en: "Switzerland", fr: "Suisse" }, visitors: 210, lat: 46.8, lng: 8.2 },
    { code: "DE", name: { en: "Germany", fr: "Allemagne" }, visitors: 190, lat: 51.2, lng: 10.4 },
    {
      code: "GB",
      name: { en: "United Kingdom", fr: "Royaume-Uni" },
      visitors: 180,
      lat: 53.5,
      lng: -2,
    },
    {
      code: "ZA",
      name: { en: "South Africa", fr: "Afrique du Sud" },
      visitors: 90,
      lat: -29,
      lng: 24,
    },
    { code: "BR", name: { en: "Brazil", fr: "Brésil" }, visitors: 70, lat: -10, lng: -52 },
  ];
}

/** Visitors by city for the last 12 months, with a map position (sample). */
export function getCities(): City[] {
  return [
    { name: "Douala", country: "CM", visitors: 3920, lat: 4.05, lng: 9.7 },
    { name: "Yaoundé", country: "CM", visitors: 3110, lat: 3.87, lng: 11.52 },
    { name: "Paris", country: "FR", visitors: 1240, lat: 48.86, lng: 2.35 },
    { name: "Montréal", country: "CA", visitors: 820, lat: 45.5, lng: -73.57 },
    { name: "Abidjan", country: "CI", visitors: 760, lat: 5.36, lng: -4 },
    { name: "Bafoussam", country: "CM", visitors: 640, lat: 5.48, lng: 10.42 },
    { name: "Libreville", country: "GA", visitors: 430, lat: 0.42, lng: 9.47 },
    { name: "Bruxelles", country: "BE", visitors: 330, lat: 50.85, lng: 4.35 },
    { name: "Houston", country: "US", visitors: 280, lat: 29.76, lng: -95.37 },
    { name: "Lyon", country: "FR", visitors: 260, lat: 45.76, lng: 4.84 },
    { name: "Toronto", country: "CA", visitors: 240, lat: 43.65, lng: -79.38 },
    { name: "Lagos", country: "NG", visitors: 220, lat: 6.52, lng: 3.38 },
  ];
}

/** Visitors by region for the last 12 months (sample). */
export function getRegions(): { name: Bilingual; country: string; visitors: number }[] {
  return [
    { name: { en: "Littoral", fr: "Littoral" }, country: "CM", visitors: 4100 },
    { name: { en: "Centre", fr: "Centre" }, country: "CM", visitors: 3300 },
    { name: { en: "Île-de-France", fr: "Île-de-France" }, country: "FR", visitors: 1400 },
    { name: { en: "West", fr: "Ouest" }, country: "CM", visitors: 1180 },
    { name: { en: "Quebec", fr: "Québec" }, country: "CA", visitors: 980 },
    { name: { en: "Abidjan", fr: "Abidjan" }, country: "CI", visitors: 760 },
    { name: { en: "Estuaire", fr: "Estuaire" }, country: "GA", visitors: 430 },
    { name: { en: "Ontario", fr: "Ontario" }, country: "CA", visitors: 420 },
  ];
}

/** Most visited pages: overall, first page of a visit and last page of a visit (sample). */
export function getPageStats() {
  return {
    top: [
      { path: "/", visitors: 8420 },
      { path: "/articles", visitors: 3120 },
      { path: "/articles/plenitude-du-saint-esprit", visitors: 2650 },
      { path: "/#books", visitors: 2210 },
      { path: "/articles/leadership-serviteur", visitors: 1980 },
      { path: "/#about", visitors: 1500 },
      { path: "/#contact", visitors: 900 },
    ],
    entered: [
      { path: "/", visitors: 6200 },
      { path: "/articles/plenitude-du-saint-esprit", visitors: 2100 },
      { path: "/articles/leadership-serviteur", visitors: 1560 },
      { path: "/articles", visitors: 1240 },
      { path: "/articles/de-bafoussam-aux-nations", visitors: 980 },
      { path: "/#books", visitors: 610 },
    ],
    exited: [
      { path: "/#contact", visitors: 3310 },
      { path: "/articles/plenitude-du-saint-esprit", visitors: 1920 },
      { path: "/", visitors: 1870 },
      { path: "/#books", visitors: 1460 },
      { path: "/articles", visitors: 1100 },
      { path: "/articles/foi-esperance-amour", visitors: 720 },
    ],
  };
}

/** Where visitors came from (sample). */
export function getReferrers(): { source: Referrer; visitors: number }[] {
  return [
    { source: "direct", visitors: 6100 },
    { source: "whatsapp", visitors: 4300 },
    { source: "facebook", visitors: 2900 },
    { source: "google", visitors: 2200 },
    { source: "youtube", visitors: 980 },
    { source: "instagram", visitors: 760 },
    { source: "linkedin", visitors: 210 },
  ];
}

/** Browsers, operating systems and device types of visitors (sample). */
export function getDeviceStats(): {
  browsers: { name: string; visitors: number }[];
  os: { name: string; visitors: number }[];
  devices: { name: DeviceType; visitors: number }[];
} {
  return {
    browsers: [
      { name: "Chrome", visitors: 9900 },
      { name: "Safari", visitors: 2880 },
      { name: "Samsung Internet", visitors: 1440 },
      { name: "Firefox", visitors: 800 },
      { name: "Edge", visitors: 640 },
      { name: "Opera", visitors: 330 },
    ],
    os: [
      { name: "Android", visitors: 9280 },
      { name: "iOS", visitors: 3360 },
      { name: "Windows", visitors: 2240 },
      { name: "macOS", visitors: 800 },
      { name: "Linux", visitors: 310 },
    ],
    devices: [
      { name: "mobile", visitors: 12640 },
      { name: "desktop", visitors: 2880 },
      { name: "tablet", visitors: 470 },
    ],
  };
}

export function getReadingLanguages() {
  return { fr: 64, en: 36 };
}

/** Headline figures with the previous month for comparison (sample). */
export function getKpis() {
  return {
    views: {
      value: 25000,
      previous: 22300,
      series: [12, 13, 13, 16, 18, 17, 21, 24, 23, 27, 30, 35],
    },
    reads: { value: 16310, previous: 14800, series: [6, 7, 7, 9, 10, 10, 12, 14, 13, 16, 18, 21] },
    shares: { value: 1655, previous: 1490, series: [8, 9, 8, 11, 12, 11, 14, 15, 13, 17, 19, 22] },
    invitations: { value: 38, previous: 41, series: [3, 2, 4, 3, 5, 4, 3, 5, 4, 3, 4, 3] },
    avgReadMinutes: 3.4,
    returningPercent: 42,
  };
}

export function getMessages(): InboxMessage[] {
  return [
    {
      id: "m1",
      name: "Pasteur Emmanuel N.",
      email: "emmanuel@example.org",
      organization: "Église Évangélique de Douala",
      type: "invitation",
      message:
        "Bonjour Professeur, nous organisons une convention pastorale à Douala du 12 au 14 décembre et serions honorés de vous recevoir comme orateur principal.",
      receivedAt: "2026-10-18T15:42:00Z",
      read: false,
    },
    {
      id: "m2",
      name: "Grace T.",
      email: "grace@example.com",
      type: "books",
      message:
        "Hello, I would like to order three copies of “Le leadership et la puissance du Saint-Esprit” for our leadership team in Montreal.",
      receivedAt: "2026-10-17T09:15:00Z",
      read: false,
    },
    {
      id: "m3",
      name: "Rev. Daniel O.",
      email: "daniel@example.org",
      organization: "Kingdom Life Church, Lagos",
      type: "invitation",
      message:
        "We would love to invite you to our annual leadership conference in March. Please let us know your availability.",
      receivedAt: "2026-10-15T18:03:00Z",
      read: true,
    },
    {
      id: "m4",
      name: "Marie-Claire B.",
      email: "marieclaire@example.com",
      type: "prayer",
      message:
        "Je vous écris pour demander la prière pour ma famille. Votre article sur la foi, l’espérance et l’amour m’a beaucoup touchée.",
      receivedAt: "2026-10-14T07:30:00Z",
      read: true,
    },
    {
      id: "m5",
      name: "Samuel K.",
      email: "samuel@example.com",
      organization: "Université chrétienne de Yaoundé",
      type: "other",
      message:
        "Nous souhaiterions explorer un partenariat académique avec la JAFAN Academy pour nos étudiants en théologie.",
      receivedAt: "2026-10-11T12:10:00Z",
      read: true,
    },
  ];
}

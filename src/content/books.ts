import type { Locale } from "@/i18n/config";

/**
 * Books shown on the site. Until the dashboard manages them, edit this file.
 *
 * PLACEHOLDER CONTENT: titles, years, publishers and summaries below are design
 * placeholders, not real books. Replace them (and add `cover` images under
 * /public/images/books) before publishing.
 */
export type Book = {
  slug: string;
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  summary: Record<Locale, string>;
  year: number;
  publisher: string;
  tags: Record<Locale, string[]>;
  /** Path under /public. When missing, a typographic cover is drawn instead. */
  cover?: string;
  /** Colour scheme of the drawn cover and of the card panel. */
  theme: "royal" | "ink" | "paper" | "sky";
  /** Where to buy or read more. */
  href?: string;
};

export const books: Book[] = [
  {
    slug: "the-majesty-of-god",
    title: { en: "The Majesty of God", fr: "La Majesté de Dieu" },
    subtitle: {
      en: "Encountering the King in worship and life",
      fr: "Rencontrer le Roi dans le culte et dans la vie",
    },
    summary: {
      en: "A theological journey into the holiness and kingship of God, and what it means for the believer to live as a servant of the Divine Majesty.",
      fr: "Un parcours théologique au cœur de la sainteté et de la royauté de Dieu, et de ce que signifie vivre en serviteur de la Divine Majesté.",
    },
    year: 2024,
    publisher: "Publisher",
    tags: { en: ["Theology", "Worship"], fr: ["Théologie", "Adoration"] },
    theme: "royal",
  },
  {
    slug: "faith-and-reason",
    title: { en: "Faith & Reason", fr: "Foi et Raison" },
    subtitle: { en: "Thinking clearly about belief", fr: "Penser clairement la foi" },
    summary: {
      en: "An accessible introduction to how faith and careful thought belong together.",
      fr: "Une introduction accessible à l'alliance de la foi et de la réflexion rigoureuse.",
    },
    year: 2022,
    publisher: "Publisher",
    tags: { en: ["Apologetics"], fr: ["Apologétique"] },
    theme: "ink",
  },
  {
    slug: "crowned-in-grace",
    title: { en: "Crowned in Grace", fr: "Couronné de grâce" },
    subtitle: { en: "A study of identity in Christ", fr: "Une étude de l'identité en Christ" },
    summary: {
      en: "What Scripture says about who we are, and why it changes how we live.",
      fr: "Ce que dit l'Écriture sur qui nous sommes, et pourquoi cela change notre vie.",
    },
    year: 2020,
    publisher: "Publisher",
    tags: { en: ["Discipleship"], fr: ["Discipulat"] },
    theme: "paper",
  },
  {
    slug: "living-theology",
    title: { en: "Living Theology", fr: "Une théologie vivante" },
    subtitle: { en: "Doctrine for everyday faith", fr: "La doctrine pour la foi au quotidien" },
    summary: {
      en: "Core Christian doctrines explained for the classroom and the congregation.",
      fr: "Les grandes doctrines chrétiennes expliquées pour la classe et pour l'Église.",
    },
    year: 2018,
    publisher: "Publisher",
    tags: { en: ["Doctrine", "Teaching"], fr: ["Doctrine", "Enseignement"] },
    theme: "sky",
  },
  {
    slug: "the-shepherds-calling",
    title: { en: "The Shepherd's Calling", fr: "L'appel du berger" },
    subtitle: { en: "Pastoral ministry today", fr: "Le ministère pastoral aujourd'hui" },
    summary: {
      en: "Reflections on caring for people, preaching the Word and leading with humility.",
      fr: "Réflexions sur le soin des personnes, la prédication et un leadership humble.",
    },
    year: 2016,
    publisher: "Publisher",
    tags: { en: ["Ministry"], fr: ["Ministère"] },
    theme: "royal",
  },
];

import type { Locale } from "@/i18n/config";

/**
 * Teaching disciplines shown on the home page. Until the dashboard manages them, edit this file.
 *
 * PLACEHOLDER CONTENT: these disciplines and descriptions are design placeholders. Replace
 * them with the subjects Professor Kamedjieu actually teaches before publishing.
 */
export type Discipline = {
  slug: string;
  icon: DisciplineIcon;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  topics: Record<Locale, string[]>;
};

export type DisciplineIcon = "doctrine" | "scripture" | "pastoral" | "ethics" | "history";

export const disciplines: Discipline[] = [
  {
    slug: "systematic-theology",
    icon: "doctrine",
    title: { en: "Systematic Theology", fr: "Théologie systématique" },
    description: {
      en: "The great doctrines of the faith, taught as one coherent and living whole.",
      fr: "Les grandes doctrines de la foi, enseignées comme un tout cohérent et vivant.",
    },
    topics: { en: ["God", "Christ", "Salvation"], fr: ["Dieu", "Christ", "Salut"] },
  },
  {
    slug: "biblical-studies",
    icon: "scripture",
    title: { en: "Biblical Studies", fr: "Études bibliques" },
    description: {
      en: "Reading Scripture closely, in its languages, history and story.",
      fr: "Lire l'Écriture de près, dans ses langues, son histoire et son récit.",
    },
    topics: {
      en: ["Exegesis", "Hermeneutics", "Old & New Testament"],
      fr: ["Exégèse", "Herméneutique", "Ancien et Nouveau Testament"],
    },
  },
  {
    slug: "pastoral-theology",
    icon: "pastoral",
    title: { en: "Pastoral Theology", fr: "Théologie pastorale" },
    description: {
      en: "Preparing pastors to preach, care for people and lead the Church well.",
      fr: "Préparer les pasteurs à prêcher, prendre soin des personnes et bien conduire l'Église.",
    },
    topics: {
      en: ["Preaching", "Counselling", "Leadership"],
      fr: ["Prédication", "Accompagnement", "Leadership"],
    },
  },
  {
    slug: "christian-ethics",
    icon: "ethics",
    title: { en: "Christian Ethics", fr: "Éthique chrétienne" },
    description: {
      en: "Thinking biblically about the questions believers face today.",
      fr: "Penser bibliquement les questions auxquelles les croyants font face aujourd'hui.",
    },
    topics: { en: ["Family", "Society", "Justice"], fr: ["Famille", "Société", "Justice"] },
  },
  {
    slug: "church-history",
    icon: "history",
    title: { en: "Church History", fr: "Histoire de l'Église" },
    description: {
      en: "Learning from two thousand years of the Church's faith and witness.",
      fr: "Apprendre de deux mille ans de foi et de témoignage de l'Église.",
    },
    topics: {
      en: ["Early Church", "Reformation", "African Christianity"],
      fr: ["Église primitive", "Réforme", "Christianisme africain"],
    },
  },
];

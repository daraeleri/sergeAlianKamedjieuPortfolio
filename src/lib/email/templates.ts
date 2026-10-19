import "server-only";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { ART_HEIGHT, ART_WIDTH } from "@/lib/newsletter-art";
import {
  button,
  details,
  emailImage,
  featured,
  heroArt,
  layout,
  panel,
  paragraph,
  promo,
  quote,
  supporting,
  url,
  type Card,
} from "./layout";
import type { Email } from "./send";

/**
 * Every email the site sends. Subscriber emails use the subscriber's language; the
 * author's notifications use AUTHOR_LOCALE ("en" by default).
 */

const name = siteConfig.name;

const copy = {
  en: {
    stayConnected: "Stay connected",
    links: { website: "Website", articles: "Articles", books: "Books", contact: "Contact" },
    unsubscribe: "Unsubscribe",
    confirm: {
      subject: "Confirm your subscription",
      preview: `One click and you'll get new articles and books from ${name}.`,
      title: "Thanks for joining us",
      body: `To start receiving the teachings of ${name}, please confirm that this is your email address.`,
      cta: "Confirm my email address",
      note: "Didn't sign up? Ignore this email and you won't be subscribed.",
      reason: "You received this because this address was entered on our newsletter form.",
    },
    welcome: {
      subject: "Welcome! Your subscription is confirmed",
      preview: "You'll be the first to know about new articles and books.",
      title: "Welcome to the family",
      body: "Your subscription is confirmed. You'll receive one email whenever a new article or book is published, nothing else.",
      cta: "Read the latest articles",
    },
    article: { eyebrow: "New article", cta: "Read the article" },
    book: { eyebrow: "New book", cta: "Discover the book" },
    moreToRead: "More to read",
    read: "Read",
    bookPromo: { title: (title: string) => `From the bookshelf: ${title}`, cta: "Learn more" },
    invitePromo: {
      title: `Invite ${name} to speak`,
      text: "For a conference, a crusade or a seminar, send an invitation through the website and it will be answered personally.",
      cta: "Send an invitation",
    },
    subscriberReason: "You're receiving this because you subscribed to new articles and books.",
    author: {
      reason: "Notification from your website's dashboard.",
      message: {
        subject: (sender: string) => `New message from ${sender}`,
        title: "You have a new message",
        intro: "Someone wrote to you through the contact form. Reply to this email to answer them.",
        name: "Name",
        email: "Email",
        organization: "Organization",
        type: "Subject",
        cta: "Open in the dashboard",
        types: {
          invitation: "Speaking invitation",
          books: "Books",
          prayer: "Prayer request",
          other: "Other",
        } as Record<string, string>,
      },
      subscriber: {
        subject: "New newsletter subscriber",
        title: "Someone joined your newsletter",
        intro: (total: number) =>
          `${total} ${total === 1 ? "person now receives" : "people now receive"} your new articles and books.`,
        email: "Email",
        language: "Language",
        cta: "See subscribers",
      },
      report: {
        subject: (title: string) => `Sent to subscribers: ${title}`,
        title: "Your announcement was sent",
        intro: (kind: string, sent: number, total: number) =>
          `The ${kind} was emailed to ${sent} of ${total} subscribers.`,
        failed: (failed: number) =>
          `${failed} could not be sent. Check the email settings (RESEND_API_KEY, EMAIL_FROM).`,
        article: "new article",
        book: "new book",
        cta: "Open the dashboard",
      },
    },
  },
  fr: {
    stayConnected: "Restons en contact",
    links: { website: "Site web", articles: "Articles", books: "Livres", contact: "Contact" },
    unsubscribe: "Se désinscrire",
    confirm: {
      subject: "Confirmez votre inscription",
      preview: `Un clic et vous recevrez les nouveaux articles et livres de ${name}.`,
      title: "Merci de nous rejoindre",
      body: `Pour recevoir les enseignements de ${name}, confirmez qu'il s'agit bien de votre adresse e-mail.`,
      cta: "Confirmer mon adresse e-mail",
      note: "Vous ne vous êtes pas inscrit ? Ignorez cet e-mail : vous ne serez pas abonné.",
      reason:
        "Vous recevez cet e-mail car cette adresse a été saisie dans notre formulaire d'inscription.",
    },
    welcome: {
      subject: "Bienvenue ! Votre inscription est confirmée",
      preview: "Vous serez le premier informé des nouveaux articles et livres.",
      title: "Bienvenue dans la famille",
      body: "Votre inscription est confirmée. Vous recevrez un e-mail à chaque nouvel article ou livre publié, rien d'autre.",
      cta: "Lire les derniers articles",
    },
    article: { eyebrow: "Nouvel article", cta: "Lire l'article" },
    book: { eyebrow: "Nouveau livre", cta: "Découvrir le livre" },
    moreToRead: "À lire aussi",
    read: "Lire",
    bookPromo: {
      title: (title: string) => `Dans la bibliothèque : ${title}`,
      cta: "En savoir plus",
    },
    invitePromo: {
      title: `Inviter ${name} à prêcher`,
      text: "Pour une conférence, une croisade ou un séminaire, envoyez une invitation depuis le site : elle recevra une réponse personnelle.",
      cta: "Envoyer une invitation",
    },
    subscriberReason:
      "Vous recevez cet e-mail car vous êtes abonné aux nouveaux articles et livres.",
    author: {
      reason: "Notification du tableau de bord de votre site.",
      message: {
        subject: (sender: string) => `Nouveau message de ${sender}`,
        title: "Vous avez un nouveau message",
        intro:
          "Quelqu'un vous a écrit via le formulaire de contact. Répondez à cet e-mail pour lui répondre.",
        name: "Nom",
        email: "E-mail",
        organization: "Organisation",
        type: "Objet",
        cta: "Ouvrir dans le tableau de bord",
        types: {
          invitation: "Invitation à prêcher",
          books: "Livres",
          prayer: "Demande de prière",
          other: "Autre",
        } as Record<string, string>,
      },
      subscriber: {
        subject: "Nouvel abonné à la newsletter",
        title: "Une personne s'est abonnée",
        intro: (total: number) =>
          `${total} ${total === 1 ? "personne reçoit" : "personnes reçoivent"} désormais vos nouveaux articles et livres.`,
        email: "E-mail",
        language: "Langue",
        cta: "Voir les abonnés",
      },
      report: {
        subject: (title: string) => `Envoyé aux abonnés : ${title}`,
        title: "Votre annonce a été envoyée",
        intro: (kind: string, sent: number, total: number) =>
          `Le ${kind} a été envoyé à ${sent} abonnés sur ${total}.`,
        failed: (failed: number) =>
          `${failed} n'ont pas pu être envoyés. Vérifiez les réglages e-mail (RESEND_API_KEY, EMAIL_FROM).`,
        article: "nouvel article",
        book: "nouveau livre",
        cta: "Ouvrir le tableau de bord",
      },
    },
  },
} satisfies Record<Locale, unknown>;

const authorLocale: Locale = process.env.AUTHOR_LOCALE === "fr" ? "fr" : "en";
const languageNames: Record<string, string> = { en: "English", fr: "Français" };

/* ---------- Shared pieces ---------- */

type Bilingual = { en: string; fr: string };
const pick = (value: Bilingual, locale: Locale) => value[locale] || value.en || value.fr;

/** Recent articles and the latest book, for the supporting and promo sections. */
export type Extras = {
  articles: { id: string; title: Bilingual; excerpt: Bilingual; cover?: string | null }[];
  book?: { title: string; description: Bilingual; cover?: string | null };
};

/** Links for one subscriber. Tokens sit after "#" so they never reach server logs. */
export function subscriberLinks(locale: Locale, token: string) {
  return {
    confirm: url(`/${locale}/newsletter/confirm#${token}`),
    unsubscribe: url(`/${locale}/newsletter/unsubscribe#${token}`),
    /** One-click unsubscribe used by Gmail, Yahoo and Apple Mail (RFC 8058). */
    oneClick: url(`/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`),
  };
}

/** Headers that give newsletters the inbox's own "Unsubscribe" button. */
function listHeaders(locale: Locale, token: string) {
  return {
    "List-Unsubscribe": `<${subscriberLinks(locale, token).oneClick}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

function footerLinks(locale: Locale) {
  const c = copy[locale].links;
  return [
    { label: c.website, href: url(`/${locale}`) },
    { label: c.articles, href: url(`/${locale}/articles`) },
    { label: c.books, href: url(`/${locale}#books`) },
    { label: c.contact, href: url(`/${locale}#contact`) },
  ];
}

function subscriberFooter(locale: Locale, token: string) {
  return {
    stayConnected: copy[locale].stayConnected,
    links: footerLinks(locale),
    reason: copy[locale].subscriberReason,
    unsubscribe: {
      label: copy[locale].unsubscribe,
      href: subscriberLinks(locale, token).unsubscribe,
    },
  };
}

function articleCards(locale: Locale, extras: Extras, exclude?: string): Card[] {
  return extras.articles
    .filter((article) => article.id !== exclude)
    .slice(0, 2)
    .map((article) => ({
      title: pick(article.title, locale),
      text: pick(article.excerpt, locale),
      image: emailImage(article.cover),
      link: { label: copy[locale].read, href: url(`/${locale}/articles/${article.id}`) },
    }));
}

function bookPromo(locale: Locale, extras: Extras) {
  if (!extras.book) return invitePromo(locale);
  const c = copy[locale].bookPromo;
  return promo({
    title: c.title(extras.book.title),
    text: pick(extras.book.description, locale),
    cta: { label: c.cta, href: url(`/${locale}#books`) },
  });
}

function invitePromo(locale: Locale) {
  const c = copy[locale].invitePromo;
  return promo({ ...c, cta: { label: c.cta, href: url(`/${locale}#contact`) } });
}

const textFooter = (locale: Locale, unsubscribe?: string) =>
  `\n\n— ${name} · ${siteConfig.location}${unsubscribe ? `\n${copy[locale].unsubscribe}: ${unsubscribe}` : ""}`;

/* ---------- Subscriber emails ---------- */

type Subscriber = { email: string; locale: Locale; token: string };

export function confirmEmail({ email, locale, token }: Subscriber): Email {
  const c = copy[locale].confirm;
  const link = subscriberLinks(locale, token).confirm;
  return {
    to: email,
    subject: c.subject,
    html: layout({
      lang: locale,
      preview: c.preview,
      sections: [
        featured({
          image: { src: heroArt(), alt: "", width: ART_WIDTH, height: ART_HEIGHT },
          title: c.title,
          text: c.body,
          cta: { label: c.cta, href: link },
          note: c.note,
        }),
      ],
      footer: {
        stayConnected: copy[locale].stayConnected,
        links: footerLinks(locale),
        reason: c.reason,
      },
    }),
    text: `${c.title}\n\n${c.body}\n\n${c.cta}: ${link}\n\n${c.note}${textFooter(locale)}`,
  };
}

export function welcomeEmail(subscriber: Subscriber, extras: Extras): Email {
  const { email, locale, token } = subscriber;
  const c = copy[locale].welcome;
  const articles = url(`/${locale}/articles`);
  const unsubscribe = subscriberLinks(locale, token).unsubscribe;
  return {
    to: email,
    subject: c.subject,
    headers: listHeaders(locale, token),
    html: layout({
      lang: locale,
      preview: c.preview,
      sections: [
        featured({
          image: { src: heroArt(), alt: "", width: ART_WIDTH, height: ART_HEIGHT },
          title: c.title,
          text: c.body,
          cta: { label: c.cta, href: articles },
        }),
        supporting(copy[locale].moreToRead, articleCards(locale, extras)),
        bookPromo(locale, extras),
      ].filter(Boolean),
      footer: subscriberFooter(locale, token),
    }),
    text: `${c.title}\n\n${c.body}\n\n${c.cta}: ${articles}${textFooter(locale, unsubscribe)}`,
  };
}

export type AnnouncedArticle = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  cover?: string | null;
};

export function articleEmail(
  subscriber: Subscriber,
  article: AnnouncedArticle,
  extras: Extras,
): Email {
  const { locale, token } = subscriber;
  const c = copy[locale].article;
  const link = url(`/${locale}/articles/${article.id}`);
  const unsubscribe = subscriberLinks(locale, token).unsubscribe;
  const cover = emailImage(article.cover);
  return {
    to: subscriber.email,
    subject: article.title,
    headers: listHeaders(locale, token),
    html: layout({
      lang: locale,
      preview: article.excerpt,
      sections: [
        featured({
          image: cover ? { src: cover, alt: article.title } : undefined,
          banner: cover ? undefined : article.category || c.eyebrow,
          eyebrow: article.category ? `${c.eyebrow} · ${article.category}` : c.eyebrow,
          title: article.title,
          text: article.excerpt,
          cta: { label: c.cta, href: link },
        }),
        supporting(copy[locale].moreToRead, articleCards(locale, extras, article.id)),
        bookPromo(locale, extras),
      ].filter(Boolean),
      footer: subscriberFooter(locale, token),
    }),
    text: `${c.eyebrow}\n\n${article.title}\n\n${article.excerpt}\n\n${c.cta}: ${link}${textFooter(locale, unsubscribe)}`,
  };
}

export type AnnouncedBook = { title: string; description: string; cover?: string | null };

export function bookEmail(subscriber: Subscriber, book: AnnouncedBook, extras: Extras): Email {
  const { locale, token } = subscriber;
  const c = copy[locale].book;
  const link = url(`/${locale}#books`);
  const unsubscribe = subscriberLinks(locale, token).unsubscribe;
  const cover = emailImage(book.cover);
  return {
    to: subscriber.email,
    subject: locale === "fr" ? `${c.eyebrow} : ${book.title}` : `${c.eyebrow}: ${book.title}`,
    headers: listHeaders(locale, token),
    html: layout({
      lang: locale,
      preview: book.description,
      sections: [
        featured({
          image: cover ? { src: cover, alt: book.title, width: 200 } : undefined,
          banner: cover ? undefined : book.title,
          eyebrow: c.eyebrow,
          title: book.title,
          text: book.description,
          cta: { label: c.cta, href: link },
        }),
        supporting(copy[locale].moreToRead, articleCards(locale, extras)),
        invitePromo(locale),
      ].filter(Boolean),
      footer: subscriberFooter(locale, token),
    }),
    text: `${c.eyebrow}\n\n${book.title}\n\n${book.description}\n\n${c.cta}: ${link}${textFooter(locale, unsubscribe)}`,
  };
}

/* ---------- Author notifications ---------- */

function authorLayout(preview: string, title: string, blocks: string[]) {
  return layout({
    lang: authorLocale,
    preview,
    sections: [panel(title, blocks)],
    footer: {
      stayConnected: copy[authorLocale].stayConnected,
      links: footerLinks(authorLocale),
      reason: copy[authorLocale].author.reason,
    },
  });
}

export function authorMessageEmail(
  to: string,
  message: {
    id: string;
    name: string;
    email: string;
    organization?: string | null;
    type: string;
    message: string;
  },
): Email {
  const c = copy[authorLocale].author.message;
  const link = url(`/${authorLocale}/dashboard/messages?id=${message.id}`);
  const rows: [string, string][] = [
    [c.name, message.name],
    [c.email, message.email],
    ...(message.organization ? [[c.organization, message.organization] as [string, string]] : []),
    [c.type, c.types[message.type] ?? message.type],
  ];
  return {
    to,
    replyTo: message.email,
    subject: c.subject(message.name),
    html: authorLayout(message.message.slice(0, 120), c.title, [
      paragraph(c.intro),
      details(rows),
      quote(message.message),
      button({ label: c.cta, href: link }),
    ]),
    text: `${c.title}\n\n${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${message.message}\n\n${c.cta}: ${link}`,
  };
}

export function authorSubscriberEmail(
  to: string,
  subscriber: { email: string; locale: string },
  total: number,
): Email {
  const c = copy[authorLocale].author.subscriber;
  const link = url(`/${authorLocale}/dashboard/subscribers`);
  const rows: [string, string][] = [
    [c.email, subscriber.email],
    [c.language, languageNames[subscriber.locale] ?? subscriber.locale],
  ];
  return {
    to,
    subject: c.subject,
    html: authorLayout(c.intro(total), c.title, [
      paragraph(c.intro(total)),
      details(rows),
      button({ label: c.cta, href: link }),
    ]),
    text: `${c.title}\n\n${c.intro(total)}\n\n${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${c.cta}: ${link}`,
  };
}

export function authorReportEmail(
  to: string,
  report: { kind: "article" | "book"; title: string; sent: number; total: number },
): Email {
  const c = copy[authorLocale].author.report;
  const link = url(
    `/${authorLocale}/dashboard/${report.kind === "article" ? "articles" : "books"}`,
  );
  const intro = c.intro(c[report.kind], report.sent, report.total);
  const failed = report.total - report.sent;
  return {
    to,
    subject: c.subject(report.title),
    html: authorLayout(intro, c.title, [
      paragraph(intro),
      ...(failed ? [paragraph(c.failed(failed), "color:#b42318;")] : []),
      button({ label: c.cta, href: link }),
    ]),
    text: `${c.title}\n\n${intro}${failed ? `\n${c.failed(failed)}` : ""}\n\n${c.cta}: ${link}`,
  };
}

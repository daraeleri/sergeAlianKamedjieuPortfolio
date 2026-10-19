import "server-only";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Email } from "./send";
import {
  button,
  details,
  emailImage,
  eyebrow,
  heading,
  image,
  layout,
  paragraph,
  quote,
  url,
} from "./layout";

/**
 * Every email the site sends. Subscriber emails use the subscriber's language; the
 * author's notifications use AUTHOR_LOCALE ("en" by default).
 */

const name = siteConfig.name;

const copy = {
  en: {
    confirm: {
      subject: "Confirm your subscription",
      preview: `One click and you'll get new articles and books from ${name}.`,
      title: "Confirm your subscription",
      body: `Thank you for wanting to receive the teachings of ${name}. Please confirm your email address to start receiving new articles and books.`,
      cta: "Confirm my subscription",
      ignore: "If you didn't sign up, ignore this email: you won't be subscribed.",
      footer: "You received this email because this address was entered on our newsletter form.",
    },
    welcome: {
      subject: "Welcome! Your subscription is confirmed",
      preview: "You'll be the first to know about new articles and books.",
      title: "Welcome, and thank you",
      body: "Your subscription is confirmed. You'll receive an email whenever a new article or book is published. Nothing else, and you can leave at any time.",
      cta: "Read the latest articles",
      footer: "You're receiving this because you subscribed to the newsletter.",
    },
    article: {
      eyebrow: "New article",
      cta: "Read the article",
      footer: "You're receiving this because you subscribed to new articles and books.",
    },
    book: {
      eyebrow: "New book",
      cta: "Discover the book",
      footer: "You're receiving this because you subscribed to new articles and books.",
    },
    unsubscribe: "Unsubscribe",
    author: {
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
      footer: "Notification from your website's dashboard.",
    },
  },
  fr: {
    confirm: {
      subject: "Confirmez votre inscription",
      preview: `Un clic et vous recevrez les nouveaux articles et livres de ${name}.`,
      title: "Confirmez votre inscription",
      body: `Merci de vouloir recevoir les enseignements de ${name}. Confirmez votre adresse e-mail pour recevoir les nouveaux articles et livres.`,
      cta: "Confirmer mon inscription",
      ignore: "Si vous ne vous êtes pas inscrit, ignorez cet e-mail : vous ne serez pas abonné.",
      footer:
        "Vous recevez cet e-mail car cette adresse a été saisie dans notre formulaire d'inscription.",
    },
    welcome: {
      subject: "Bienvenue ! Votre inscription est confirmée",
      preview: "Vous serez le premier informé des nouveaux articles et livres.",
      title: "Bienvenue, et merci",
      body: "Votre inscription est confirmée. Vous recevrez un e-mail à chaque nouvel article ou livre publié. Rien d'autre, et vous pouvez vous désinscrire à tout moment.",
      cta: "Lire les derniers articles",
      footer: "Vous recevez cet e-mail car vous êtes abonné à la newsletter.",
    },
    article: {
      eyebrow: "Nouvel article",
      cta: "Lire l'article",
      footer: "Vous recevez cet e-mail car vous êtes abonné aux nouveaux articles et livres.",
    },
    book: {
      eyebrow: "Nouveau livre",
      cta: "Découvrir le livre",
      footer: "Vous recevez cet e-mail car vous êtes abonné aux nouveaux articles et livres.",
    },
    unsubscribe: "Se désinscrire",
    author: {
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
      footer: "Notification du tableau de bord de votre site.",
    },
  },
} satisfies Record<Locale, unknown>;

const authorLocale: Locale = process.env.AUTHOR_LOCALE === "fr" ? "fr" : "en";
const languageNames: Record<string, string> = { en: "English", fr: "Français" };

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
  const links = subscriberLinks(locale, token);
  return {
    "List-Unsubscribe": `<${links.oneClick}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

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
      footer: c.footer,
      body:
        heading(c.title) +
        paragraph(c.body) +
        button(c.cta, link) +
        paragraph(c.ignore, "font-size:13px;margin:0;"),
    }),
    text: `${c.title}\n\n${c.body}\n\n${c.cta}: ${link}\n\n${c.ignore}`,
  };
}

export function welcomeEmail({ email, locale, token }: Subscriber): Email {
  const c = copy[locale].welcome;
  const links = subscriberLinks(locale, token);
  const articles = url(`/${locale}/articles`);
  return {
    to: email,
    subject: c.subject,
    headers: listHeaders(locale, token),
    html: layout({
      lang: locale,
      preview: c.preview,
      footer: c.footer,
      unsubscribe: { label: copy[locale].unsubscribe, href: links.unsubscribe },
      body: heading(c.title) + paragraph(c.body) + button(c.cta, articles),
    }),
    text: `${c.title}\n\n${c.body}\n\n${c.cta}: ${articles}\n\n${copy[locale].unsubscribe}: ${links.unsubscribe}`,
  };
}

export type AnnouncedArticle = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  cover?: string | null;
};

export function articleEmail(subscriber: Subscriber, article: AnnouncedArticle): Email {
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
      footer: c.footer,
      unsubscribe: { label: copy[locale].unsubscribe, href: unsubscribe },
      body:
        (cover ? image(cover, article.title) : "") +
        eyebrow(article.category ? `${c.eyebrow} · ${article.category}` : c.eyebrow) +
        heading(article.title) +
        paragraph(article.excerpt) +
        button(c.cta, link),
    }),
    text: `${c.eyebrow}\n\n${article.title}\n\n${article.excerpt}\n\n${c.cta}: ${link}\n\n${copy[locale].unsubscribe}: ${unsubscribe}`,
  };
}

export type AnnouncedBook = { title: string; description: string; cover?: string | null };

export function bookEmail(subscriber: Subscriber, book: AnnouncedBook): Email {
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
      footer: c.footer,
      unsubscribe: { label: copy[locale].unsubscribe, href: unsubscribe },
      body:
        (cover
          ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;"><tr><td>${image(cover, book.title, 220)}</td></tr></table>`
          : "") +
        eyebrow(c.eyebrow) +
        heading(book.title) +
        paragraph(book.description) +
        button(c.cta, link),
    }),
    text: `${c.eyebrow}\n\n${book.title}\n\n${book.description}\n\n${c.cta}: ${link}\n\n${copy[locale].unsubscribe}: ${unsubscribe}`,
  };
}

/* ---------- Author notifications ---------- */

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
    html: layout({
      lang: authorLocale,
      preview: message.message.slice(0, 120),
      footer: copy[authorLocale].author.footer,
      body:
        heading(c.title) +
        paragraph(c.intro) +
        details(rows) +
        quote(message.message) +
        button(c.cta, link),
    }),
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
    html: layout({
      lang: authorLocale,
      preview: c.intro(total),
      footer: copy[authorLocale].author.footer,
      body: heading(c.title) + paragraph(c.intro(total)) + details(rows) + button(c.cta, link),
    }),
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
    html: layout({
      lang: authorLocale,
      preview: intro,
      footer: copy[authorLocale].author.footer,
      body:
        heading(c.title) +
        paragraph(intro) +
        (failed ? paragraph(c.failed(failed), "color:#b42318;") : "") +
        button(c.cta, link),
    }),
    text: `${c.title}\n\n${intro}${failed ? `\n${c.failed(failed)}` : ""}\n\n${c.cta}: ${link}`,
  };
}

import type { Locale } from "@/i18n/config";

/**
 * Article bodies as a list of blocks (Medium-style), keyed by locale then by article slug
 * (the `slug` of each article in `articles.items`).
 *
 * SAMPLE CONTENT: placeholder bodies for the six sample articles, to design the article
 * page. Replace them with real articles (later managed from the dashboard). Images reuse
 * files already in /public until real photos exist.
 *
 * Inline text supports **bold** and *italic*. Bible quotes use public-domain versions
 * (King James Version in English, Louis Segond 1910 in French).
 */
export type ArticleBlock =
  | { type: "p"; text: string }
  /** Section heading; `id` is the anchor used by the table of contents. */
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; text: string }
  /** Highlighted Bible verse with its reference. */
  | { type: "verse"; text: string; reference: string }
  /** Pull quote, Medium style. */
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  /**
   * Image inside the article, with its intrinsic size. `wide` lets it break out of the
   * text column; `framed` shows it whole on a light card (cut-outs, covers, maps).
   */
  | {
      type: "image";
      src: string;
      width: number;
      height: number;
      alt: string;
      caption?: string;
      wide?: boolean;
      framed?: boolean;
    };

const placeholderCover = { src: "/images/books/placeholder-cover.jpg", width: 433, height: 612 };
const portrait = { src: "/images/PersonaImage.png", width: 960, height: 1280 };
const worldMap = { src: "/svg/world-map.svg", width: 1010, height: 666 };

const en: Record<string, ArticleBlock[]> = {
  "plenitude-du-saint-esprit": [
    {
      type: "p",
      text: "Many believers know the Holy Spirit as a doctrine; far fewer know Him as a daily companion. Yet the life Jesus promised His disciples was never meant to be lived in our own strength. It is a life *led*, *filled* and *empowered* by the Spirit of God.",
    },
    { type: "h2", id: "promise", text: "A promise for every believer" },
    {
      type: "p",
      text: "Before His ascension, Jesus did not leave His disciples with a strategy but with a promise. They were to wait in Jerusalem until they were clothed with power from on high. The Church was born in that power, and it still depends on it today.",
    },
    {
      type: "verse",
      text: "But ye shall receive power, after that the Holy Ghost is come upon you: and ye shall be witnesses unto me both in Jerusalem, and in all Judaea, and in Samaria, and unto the uttermost part of the earth.",
      reference: "Acts 1:8",
    },
    { type: "h2", id: "daily", text: "Being led day after day" },
    {
      type: "p",
      text: "The fullness of the Spirit is not a single experience we look back on. It is a **daily dependence**: a heart that listens, obeys and yields. In practice, this walk is built on a few simple habits.",
    },
    {
      type: "list",
      items: [
        "**Prayer** that listens as much as it speaks.",
        "**The Word**, through which the Spirit speaks with authority.",
        "**Obedience** in small things, before great assignments.",
        "**Fellowship** with believers who also seek His presence.",
      ],
    },
    {
      type: "quote",
      text: "The Holy Spirit does not come to decorate our lives, but to direct them.",
      cite: "Prof. Serge Alain Kamedjieu",
    },
    { type: "h2", id: "church", text: "A Spirit-filled Church" },
    {
      type: "p",
      text: "When believers walk in the Spirit, the Church becomes what God intended: a place of truth, love and power, where lives are transformed and nations are reached. This is the vision that drives the ministry of JAFAN.",
    },
  ],
  "leadership-serviteur": [
    {
      type: "p",
      text: "In the world, leadership is often measured by position, titles and influence. In the Kingdom of God, it is measured by something else entirely: **service**. Jesus Himself set the standard when He washed His disciples' feet.",
    },
    { type: "h2", id: "model", text: "The model of Christ" },
    {
      type: "verse",
      text: "But whosoever will be great among you, let him be your minister; and whosoever will be chief among you, let him be your servant.",
      reference: "Matthew 20:26-27",
    },
    {
      type: "p",
      text: "Servant leadership does not mean weak leadership. It means authority placed at the service of others, vision that lifts people up instead of using them.",
    },
    {
      type: "image",
      ...portrait,
      alt: "Prof. Serge Alain Kamedjieu",
      caption: "Prof. Kamedjieu teaches servant leadership to pastors and ministry leaders.",
      framed: true,
    },
    { type: "h2", id: "principles", text: "Four principles for leaders" },
    {
      type: "list",
      ordered: true,
      items: [
        "**Lead from the knees**: prayer comes before planning.",
        "**Serve before you are served**: example is the first sermon.",
        "**Raise others up**: a leader is measured by the leaders he forms.",
        "**Stay accountable**: authority without accountability becomes dangerous.",
      ],
    },
    {
      type: "quote",
      text: "The greatest leader in the room is the one most willing to serve it.",
    },
    { type: "h2", id: "today", text: "Leading like Jesus today" },
    {
      type: "p",
      text: "Whether you lead a church, a ministry, a business or a family, the call is the same: lead the way Christ led. That is the heart of the leadership training offered at the JAFAN Academy.",
    },
  ],
  "autorite-des-ecritures-aujourd-hui": [
    {
      type: "p",
      text: "We live in an age where every opinion seems to carry the same weight. In such a world, the question is not only *what* we believe, but *on what authority* we believe it.",
    },
    { type: "h2", id: "foundation", text: "The foundation of our faith" },
    {
      type: "verse",
      text: "All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness.",
      reference: "2 Timothy 3:16",
    },
    {
      type: "p",
      text: "Scripture is not one voice among many. It is the Word of God, the final reference for faith, doctrine and life. When the Church drifts from it, it loses both its direction and its power.",
    },
    {
      type: "image",
      ...placeholderCover,
      alt: "Cover of a book by Prof. Kamedjieu",
      caption: "“L'autorité des Écritures”, a plea for a return to the supremacy of the Word.",
      framed: true,
    },
    { type: "h2", id: "why", text: "Why it still matters" },
    {
      type: "list",
      items: [
        "It **guards** the Church from error and passing trends.",
        "It **feeds** believers with truth that does not change.",
        "It **equips** leaders to teach with clarity and confidence.",
      ],
    },
    {
      type: "quote",
      text: "A Church that closes its Bible soon opens its doors to every wind of doctrine.",
      cite: "Prof. Serge Alain Kamedjieu",
    },
    { type: "h2", id: "return", text: "A return to the Word" },
    {
      type: "p",
      text: "The way forward is not new: read the Word, teach the Word, live the Word. Every revival in history began with a return to Scripture, and the next one will be no different.",
    },
  ],
  "de-bafoussam-aux-nations": [
    {
      type: "p",
      text: "It all began in Bafoussam, in the West Region of Cameroon. From a local church grew a ministry that today carries the Gospel through crusades and conferences across the nations.",
    },
    {
      type: "image",
      ...worldMap,
      alt: "World map with Cameroon highlighted",
      caption: "From Cameroon to the nations: the reach of JAFAN Ministries.",
      wide: true,
      framed: true,
    },
    { type: "h2", id: "call", text: "A call to the nations" },
    {
      type: "verse",
      text: "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost.",
      reference: "Matthew 28:19",
    },
    {
      type: "p",
      text: "Since his call to ministry in 1996, Prof. Kamedjieu has understood the Great Commission as a personal assignment. Every crusade is an opportunity to see lives transformed by the Gospel.",
    },
    { type: "h2", id: "lessons", text: "Lessons from the field" },
    {
      type: "list",
      items: [
        "**Prayer prepares the ground** long before the first meeting.",
        "**Local churches are the key**: crusades must strengthen them.",
        "**Follow-up matters** as much as the call to salvation.",
        "**Training multiplies** the harvest: today's converts are tomorrow's leaders.",
      ],
    },
    {
      type: "quote",
      text: "Evangelism without discipleship fills a field for a day. Discipleship fills the Church for a generation.",
    },
    { type: "h2", id: "next", text: "What comes next" },
    {
      type: "p",
      text: "The vision remains the same: to restore authority, manifest power and transform the nations, starting from Bafoussam and reaching to the ends of the earth.",
    },
  ],
  "foi-esperance-amour": [
    {
      type: "p",
      text: "Faith, hope and love are not only beautiful words for weddings and greeting cards. They are the three virtues the apostle Paul says will remain when everything else has passed away.",
    },
    {
      type: "verse",
      text: "And now abideth faith, hope, charity, these three; but the greatest of these is charity.",
      reference: "1 Corinthians 13:13",
    },
    { type: "h2", id: "faith", text: "Faith that trusts" },
    {
      type: "p",
      text: "Faith is not the absence of questions but the decision to trust God in the middle of them. It grows as we hear the Word and as we see God keep His promises.",
    },
    { type: "h2", id: "hope", text: "Hope that endures" },
    {
      type: "p",
      text: "Hope looks beyond today's difficulties to God's faithfulness tomorrow. It is the anchor of the soul when circumstances are uncertain.",
    },
    { type: "h2", id: "love", text: "Love that serves" },
    {
      type: "p",
      text: "Love is the greatest of the three because it is the very nature of God. It shows itself in simple, concrete ways:",
    },
    {
      type: "list",
      items: [
        "At **home**: patience, forgiveness and time given.",
        "At **work**: integrity, excellence and kindness.",
        "In the **church**: service, unity and generosity.",
      ],
    },
    {
      type: "quote",
      text: "Faith receives, hope waits, but love gives.",
    },
  ],
  "former-des-leaders": [
    {
      type: "p",
      text: "Every church that grows eventually faces the same question: who will lead? Without trained leaders, growth becomes fragile and the vision depends on a single person.",
    },
    { type: "h2", id: "vision", text: "The vision behind the JAFAN Academy" },
    {
      type: "p",
      text: "Founded in 2007, the **JAFAN Academy of World Evangelism** exists to equip men and women to serve with both knowledge and anointing. Through partnerships with international schools and universities, it offers a complete path from Certificate to Doctorate.",
    },
    {
      type: "verse",
      text: "And the things that thou hast heard of me among many witnesses, the same commit thou to faithful men, who shall be able to teach others also.",
      reference: "2 Timothy 2:2",
    },
    { type: "h2", id: "why", text: "Why training matters" },
    {
      type: "list",
      ordered: true,
      items: [
        "**Sound doctrine** protects the flock.",
        "**Practical skills** help leaders serve well.",
        "**Spiritual formation** keeps leaders humble and dependent on God.",
        "**Multiplication**: trained leaders train others.",
      ],
    },
    {
      type: "image",
      ...placeholderCover,
      alt: "A book by Prof. Kamedjieu",
      caption: "Teaching materials developed for the JAFAN Academy.",
      framed: true,
    },
    {
      type: "quote",
      text: "Knowledge without anointing is dry; anointing without knowledge is dangerous. The Church needs both.",
      cite: "Prof. Serge Alain Kamedjieu",
    },
    { type: "h2", id: "join", text: "An invitation" },
    {
      type: "p",
      text: "If you sense a call to serve, training is not a delay to your ministry; it is an investment in it. The Academy welcomes students from every nation.",
    },
  ],
};

const fr: Record<string, ArticleBlock[]> = {
  "plenitude-du-saint-esprit": [
    {
      type: "p",
      text: "Beaucoup de croyants connaissent le Saint-Esprit comme une doctrine ; bien moins Le connaissent comme un compagnon de chaque jour. Pourtant, la vie que Jésus a promise à Ses disciples n'a jamais été conçue pour être vécue par nos propres forces. C'est une vie *conduite*, *remplie* et *fortifiée* par l'Esprit de Dieu.",
    },
    { type: "h2", id: "promesse", text: "Une promesse pour chaque croyant" },
    {
      type: "p",
      text: "Avant Son ascension, Jésus n'a pas laissé à Ses disciples une stratégie, mais une promesse. Ils devaient attendre à Jérusalem d'être revêtus de la puissance d'en haut. L'Église est née dans cette puissance, et elle en dépend encore aujourd'hui.",
    },
    {
      type: "verse",
      text: "Mais vous recevrez une puissance, le Saint-Esprit survenant sur vous, et vous serez mes témoins à Jérusalem, dans toute la Judée, dans la Samarie, et jusqu'aux extrémités de la terre.",
      reference: "Actes 1:8",
    },
    { type: "h2", id: "chaque-jour", text: "Être conduit jour après jour" },
    {
      type: "p",
      text: "La plénitude de l'Esprit n'est pas une expérience unique à laquelle on repense. C'est une **dépendance quotidienne** : un cœur qui écoute, obéit et se soumet. Concrètement, cette marche repose sur quelques habitudes simples.",
    },
    {
      type: "list",
      items: [
        "**La prière**, qui écoute autant qu'elle parle.",
        "**La Parole**, par laquelle l'Esprit parle avec autorité.",
        "**L'obéissance** dans les petites choses, avant les grandes missions.",
        "**La communion** avec des croyants qui recherchent aussi Sa présence.",
      ],
    },
    {
      type: "quote",
      text: "Le Saint-Esprit ne vient pas décorer nos vies, mais les diriger.",
      cite: "Prof. Serge Alain Kamedjieu",
    },
    { type: "h2", id: "eglise", text: "Une Église remplie de l'Esprit" },
    {
      type: "p",
      text: "Quand les croyants marchent selon l'Esprit, l'Église devient ce que Dieu voulait : un lieu de vérité, d'amour et de puissance, où les vies sont transformées et les nations atteintes. C'est la vision qui anime le ministère JAFAN.",
    },
  ],
  "leadership-serviteur": [
    {
      type: "p",
      text: "Dans le monde, le leadership se mesure souvent à la position, aux titres et à l'influence. Dans le Royaume de Dieu, il se mesure à tout autre chose : **le service**. Jésus Lui-même a donné l'exemple en lavant les pieds de Ses disciples.",
    },
    { type: "h2", id: "modele", text: "Le modèle du Christ" },
    {
      type: "verse",
      text: "Quiconque veut être grand parmi vous, qu'il soit votre serviteur ; et quiconque veut être le premier parmi vous, qu'il soit votre esclave.",
      reference: "Matthieu 20:26-27",
    },
    {
      type: "p",
      text: "Le leadership serviteur n'est pas un leadership faible. C'est une autorité mise au service des autres, une vision qui élève les gens au lieu de les utiliser.",
    },
    {
      type: "image",
      ...portrait,
      alt: "Prof. Serge Alain Kamedjieu",
      caption: "Le Prof. Kamedjieu enseigne le leadership serviteur aux pasteurs et responsables.",
      framed: true,
    },
    { type: "h2", id: "principes", text: "Quatre principes pour les leaders" },
    {
      type: "list",
      ordered: true,
      items: [
        "**Diriger à genoux** : la prière précède la planification.",
        "**Servir avant d'être servi** : l'exemple est le premier sermon.",
        "**Élever les autres** : un leader se mesure aux leaders qu'il forme.",
        "**Rester redevable** : une autorité sans redevabilité devient dangereuse.",
      ],
    },
    {
      type: "quote",
      text: "Le plus grand leader de la pièce est celui qui est le plus prêt à la servir.",
    },
    { type: "h2", id: "aujourd-hui", text: "Diriger comme Jésus aujourd'hui" },
    {
      type: "p",
      text: "Que vous dirigiez une église, un ministère, une entreprise ou une famille, l'appel est le même : diriger comme le Christ a dirigé. C'est le cœur de la formation au leadership proposée à la JAFAN Academy.",
    },
  ],
  "autorite-des-ecritures-aujourd-hui": [
    {
      type: "p",
      text: "Nous vivons à une époque où chaque opinion semble avoir le même poids. Dans un tel monde, la question n'est pas seulement *ce que* nous croyons, mais *sur quelle autorité* nous le croyons.",
    },
    { type: "h2", id: "fondement", text: "Le fondement de notre foi" },
    {
      type: "verse",
      text: "Toute Écriture est inspirée de Dieu, et utile pour enseigner, pour convaincre, pour corriger, pour instruire dans la justice.",
      reference: "2 Timothée 3:16",
    },
    {
      type: "p",
      text: "L'Écriture n'est pas une voix parmi d'autres. Elle est la Parole de Dieu, la référence ultime pour la foi, la doctrine et la vie. Quand l'Église s'en éloigne, elle perd à la fois sa direction et sa puissance.",
    },
    {
      type: "image",
      ...placeholderCover,
      alt: "Couverture d'un ouvrage du Prof. Kamedjieu",
      caption:
        "« L'autorité des Écritures », un plaidoyer pour le retour à la suprématie de la Parole.",
      framed: true,
    },
    { type: "h2", id: "pourquoi", text: "Pourquoi elle compte encore" },
    {
      type: "list",
      items: [
        "Elle **protège** l'Église de l'erreur et des modes passagères.",
        "Elle **nourrit** les croyants d'une vérité qui ne change pas.",
        "Elle **équipe** les leaders pour enseigner avec clarté et assurance.",
      ],
    },
    {
      type: "quote",
      text: "Une Église qui ferme sa Bible ouvre bientôt ses portes à tout vent de doctrine.",
      cite: "Prof. Serge Alain Kamedjieu",
    },
    { type: "h2", id: "retour", text: "Un retour à la Parole" },
    {
      type: "p",
      text: "Le chemin n'est pas nouveau : lire la Parole, enseigner la Parole, vivre la Parole. Chaque réveil de l'histoire a commencé par un retour aux Écritures, et le prochain ne fera pas exception.",
    },
  ],
  "de-bafoussam-aux-nations": [
    {
      type: "p",
      text: "Tout a commencé à Bafoussam, dans la Région de l'Ouest du Cameroun. D'une église locale est né un ministère qui porte aujourd'hui l'Évangile à travers les nations par des croisades et des conférences.",
    },
    {
      type: "image",
      ...worldMap,
      alt: "Carte du monde avec le Cameroun en évidence",
      caption: "Du Cameroun aux nations : le rayonnement de JAFAN Ministries.",
      wide: true,
      framed: true,
    },
    { type: "h2", id: "appel", text: "Un appel pour les nations" },
    {
      type: "verse",
      text: "Allez, faites de toutes les nations des disciples, les baptisant au nom du Père, du Fils et du Saint-Esprit.",
      reference: "Matthieu 28:19",
    },
    {
      type: "p",
      text: "Depuis son appel au ministère en 1996, le Prof. Kamedjieu a compris la Grande Mission comme une affectation personnelle. Chaque croisade est une occasion de voir des vies transformées par l'Évangile.",
    },
    { type: "h2", id: "lecons", text: "Leçons du terrain" },
    {
      type: "list",
      items: [
        "**La prière prépare le terrain** bien avant la première réunion.",
        "**Les églises locales sont la clé** : les croisades doivent les fortifier.",
        "**Le suivi compte** autant que l'appel au salut.",
        "**La formation multiplie** la moisson : les convertis d'aujourd'hui sont les leaders de demain.",
      ],
    },
    {
      type: "quote",
      text: "L'évangélisation sans discipulat remplit un terrain pour un jour. Le discipulat remplit l'Église pour une génération.",
    },
    { type: "h2", id: "la-suite", text: "La suite" },
    {
      type: "p",
      text: "La vision reste la même : restaurer l'autorité, manifester la puissance et transformer les nations, en partant de Bafoussam jusqu'aux extrémités de la terre.",
    },
  ],
  "foi-esperance-amour": [
    {
      type: "p",
      text: "La foi, l'espérance et l'amour ne sont pas seulement de beaux mots pour les mariages et les cartes de vœux. Ce sont les trois vertus dont l'apôtre Paul dit qu'elles demeureront quand tout le reste aura passé.",
    },
    {
      type: "verse",
      text: "Maintenant donc ces trois choses demeurent : la foi, l'espérance, la charité ; mais la plus grande de ces choses, c'est la charité.",
      reference: "1 Corinthiens 13:13",
    },
    { type: "h2", id: "foi", text: "Une foi qui fait confiance" },
    {
      type: "p",
      text: "La foi n'est pas l'absence de questions, mais la décision de faire confiance à Dieu au milieu d'elles. Elle grandit à mesure que nous écoutons la Parole et que nous voyons Dieu tenir Ses promesses.",
    },
    { type: "h2", id: "esperance", text: "Une espérance qui tient bon" },
    {
      type: "p",
      text: "L'espérance regarde au-delà des difficultés d'aujourd'hui vers la fidélité de Dieu demain. Elle est l'ancre de l'âme quand les circonstances sont incertaines.",
    },
    { type: "h2", id: "amour", text: "Un amour qui sert" },
    {
      type: "p",
      text: "L'amour est la plus grande des trois, car il est la nature même de Dieu. Il se manifeste de façons simples et concrètes :",
    },
    {
      type: "list",
      items: [
        "À la **maison** : patience, pardon et temps donné.",
        "Au **travail** : intégrité, excellence et bienveillance.",
        "À l'**église** : service, unité et générosité.",
      ],
    },
    {
      type: "quote",
      text: "La foi reçoit, l'espérance attend, mais l'amour donne.",
    },
  ],
  "former-des-leaders": [
    {
      type: "p",
      text: "Toute église qui grandit finit par se poser la même question : qui va diriger ? Sans leaders formés, la croissance devient fragile et la vision repose sur une seule personne.",
    },
    { type: "h2", id: "vision", text: "La vision de la JAFAN Academy" },
    {
      type: "p",
      text: "Fondée en 2007, la **JAFAN Academy of World Evangelism** existe pour équiper des hommes et des femmes à servir avec connaissance et onction. Grâce à des partenariats avec des écoles et universités internationales, elle propose un cycle complet du Certificat au Doctorat.",
    },
    {
      type: "verse",
      text: "Et ce que tu as entendu de moi en présence de beaucoup de témoins, confie-le à des hommes fidèles, qui soient capables de l'enseigner aussi à d'autres.",
      reference: "2 Timothée 2:2",
    },
    { type: "h2", id: "pourquoi", text: "Pourquoi la formation compte" },
    {
      type: "list",
      ordered: true,
      items: [
        "**Une saine doctrine** protège le troupeau.",
        "**Des compétences pratiques** aident les leaders à bien servir.",
        "**La formation spirituelle** garde les leaders humbles et dépendants de Dieu.",
        "**La multiplication** : des leaders formés en forment d'autres.",
      ],
    },
    {
      type: "image",
      ...placeholderCover,
      alt: "Un ouvrage du Prof. Kamedjieu",
      caption: "Supports d'enseignement développés pour la JAFAN Academy.",
      framed: true,
    },
    {
      type: "quote",
      text: "La connaissance sans onction est sèche ; l'onction sans connaissance est dangereuse. L'Église a besoin des deux.",
      cite: "Prof. Serge Alain Kamedjieu",
    },
    { type: "h2", id: "invitation", text: "Une invitation" },
    {
      type: "p",
      text: "Si vous ressentez un appel à servir, la formation n'est pas un retard pour votre ministère ; c'est un investissement. L'Académie accueille des étudiants de toutes les nations.",
    },
  ],
};

export const articleBodies: Record<Locale, Record<string, ArticleBlock[]>> = { en, fr };

/** Estimated reading time in minutes (about 200 words per minute), at least 1. */
export function readingMinutes(blocks: ArticleBlock[]) {
  const words = blocks
    .map((block) => {
      if (block.type === "list") return block.items.join(" ");
      if (block.type === "image") return block.caption ?? "";
      return block.text;
    })
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

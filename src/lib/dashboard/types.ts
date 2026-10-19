import type { ArticleBlock } from "@/content/article-bodies";

/** Where a piece of content is on its way to publication. */
export type ContentStatus = "idea" | "draft" | "review" | "scheduled" | "published";

export const contentStatuses: ContentStatus[] = [
  "idea",
  "draft",
  "review",
  "scheduled",
  "published",
];

/** Text in both site languages. */
export type Bilingual = { en: string; fr: string };

export type ArticleDoc = {
  id: string;
  status: ContentStatus;
  category: Bilingual;
  title: Bilingual;
  excerpt: Bilingual;
  cover?: string;
  body: { en: ArticleBlock[]; fr: ArticleBlock[] };
  /** ISO date-time. */
  updatedAt: string;
  views: number;
  reads: number;
  shares: number;
};

export type BookDoc = {
  id: string;
  status: ContentStatus;
  title: string;
  description: Bilingual;
  tags: string[];
  cover?: string;
  pages?: number;
  year?: number;
  updatedAt: string;
  views: number;
  orders: number;
};

export type MessageType = "invitation" | "books" | "prayer" | "other";

export type InboxMessage = {
  id: string;
  name: string;
  email: string;
  organization?: string;
  type: MessageType;
  message: string;
  receivedAt: string;
  read: boolean;
};

export type ShareChannel = "whatsapp" | "copy" | "email" | "native";

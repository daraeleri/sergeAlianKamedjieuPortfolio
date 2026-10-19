// Copies the site's current articles and books into the database. Safe to run again:
// rows that already exist are left as they are.
//
//   pnpm db:seed
import { config } from "dotenv";
import pg from "pg";
import en from "../src/i18n/dictionaries/en.json" with { type: "json" };
import fr from "../src/i18n/dictionaries/fr.json" with { type: "json" };
import { articleBodies } from "../src/content/article-bodies.ts";
import { articleMeta } from "../src/content/articles.ts";
import { bookCovers } from "../src/content/books.ts";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

const client = new pg.Client({ connectionString: process.env.DIRECT_URL });
await client.connect();

let articles = 0;
for (const item of en.articles.items) {
  const frItem = fr.articles.items.find((other) => other.slug === item.slug) ?? item;
  const meta = articleMeta[item.slug];
  const result = await client.query(
    `INSERT INTO "Article" (id, status, "categoryEn", "categoryFr", "titleEn", "titleFr",
       "excerptEn", "excerptFr", cover, theme, "bodyEn", "bodyFr", "publishedAt", "updatedAt")
     VALUES ($1, 'published', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $12)
     ON CONFLICT (id) DO NOTHING`,
    [
      item.slug,
      item.category,
      frItem.category,
      item.title,
      frItem.title,
      item.excerpt,
      frItem.excerpt,
      meta?.image ?? null,
      meta?.theme ?? "spirit",
      JSON.stringify(articleBodies.en[item.slug] ?? []),
      JSON.stringify(articleBodies.fr[item.slug] ?? []),
      new Date(meta?.date ?? Date.now()),
    ],
  );
  articles += result.rowCount ?? 0;
}

let books = 0;
for (const [position, item] of en.books.items.entries()) {
  const frItem = fr.books.items.find((other) => other.slug === item.slug) ?? item;
  const result = await client.query(
    `INSERT INTO "Book" (id, status, title, "descriptionEn", "descriptionFr", "tagsEn", "tagsFr", cover,
       position, "updatedAt")
     VALUES ($1, 'published', $2, $3, $4, $5, $6, $7, $8, now())
     ON CONFLICT (id) DO NOTHING`,
    [
      item.slug,
      item.title,
      item.description,
      frItem.description,
      item.tags,
      frItem.tags,
      bookCovers[item.slug] ?? null,
      position,
    ],
  );
  books += result.rowCount ?? 0;
}

await client.end();
console.log(`Seeded ${articles} articles and ${books} books.`);

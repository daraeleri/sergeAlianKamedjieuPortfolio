import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma client for the Neon Postgres database (pooled connection). Kept on
 * `globalThis` in development so hot reloads don't open a new pool each time.
 */
function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local (see .env.example).");
  }
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: withVerifiedSsl(connectionString) }),
  });
}

/**
 * Neon URLs come with `sslmode=require`, which `pg` already treats as `verify-full` but
 * warns about on every connection. Asking for `verify-full` keeps the same security and
 * drops the warning.
 */
function withVerifiedSsl(url: string) {
  return url.replace(/sslmode=(prefer|require|verify-ca)\b/, "sslmode=verify-full");
}

const globalForDb = globalThis as unknown as { db?: ReturnType<typeof createClient> };

// After `prisma generate` (a schema change), the cached client is an instance of the
// previous PrismaClient and lacks the new models, so it is replaced instead of reused.
const cached = globalForDb.db instanceof PrismaClient ? globalForDb.db : undefined;

export const db = cached ?? createClient();

if (process.env.NODE_ENV !== "production") globalForDb.db = db;

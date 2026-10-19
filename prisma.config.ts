import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Next.js reads .env.local; load it for the Prisma CLI too.
config({ path: ".env.local", quiet: true });
config({ quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.mjs",
  },
  // Migrations need a direct (unpooled) connection.
  datasource: { url: env("DIRECT_URL") },
});

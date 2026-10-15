import { z } from "zod";

/**
 * Validated environment variables. Import `env` instead of reading `process.env`
 * directly so a missing or malformed variable fails fast with a clear message.
 */
const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
});

export const env = schema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

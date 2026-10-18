import { z } from "zod";

/** Request types offered in the contact form (labels live in `contact.form.types`). */
export const requestTypes = ["invitation", "books", "prayer", "other"] as const;
export type RequestType = (typeof requestTypes)[number];

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().trim().max(200),
  organization: z.string().trim().max(150).optional().default(""),
  type: z.enum(requestTypes),
  message: z.string().trim().min(10).max(5000),
});

export type ContactMessage = z.infer<typeof contactSchema>;
export type ContactField = "name" | "email" | "type" | "message";

/** Values echoed back so the form keeps what the visitor typed after an error. */
export type ContactValues = Partial<Record<keyof ContactMessage, string>>;

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "invalid"; fields: ContactField[]; values: ContactValues }
  | { status: "error"; reason: "generic" | "unavailable"; values: ContactValues };

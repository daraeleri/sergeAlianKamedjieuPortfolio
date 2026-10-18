"use server";

import { contactSchema, type ContactField, type ContactState } from "@/lib/contact";
import { deliverContactMessage } from "@/lib/contact-delivery";

const fields = ["name", "email", "organization", "type", "message"] as const;

/** Server Action behind the home-page contact form (used with `useActionState`). */
export async function sendContactMessage(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field; bots often do.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success" };
  }

  const values = Object.fromEntries(
    fields.map((field) => [field, String(formData.get(field) ?? "")]),
  );
  const parsed = contactSchema.safeParse(values);

  if (!parsed.success) {
    const invalid = new Set<ContactField>();
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "name" || field === "email" || field === "type" || field === "message") {
        invalid.add(field);
      }
    }
    return { status: "invalid", fields: [...invalid], values };
  }

  try {
    const result = await deliverContactMessage(parsed.data);
    return result === "sent"
      ? { status: "success" }
      : { status: "error", reason: "unavailable", values };
  } catch (error) {
    console.error("[contact] Delivery failed:", error);
    return { status: "error", reason: "generic", values };
  }
}

import "server-only";
import { after } from "next/server";
import type { ContactMessage } from "@/lib/contact";
import { db } from "@/lib/db";
import { emailConfig, sendEmail } from "@/lib/email/send";
import { authorMessageEmail } from "@/lib/email/templates";

/**
 * Delivers a validated contact message: saves it to the database, where it shows in
 * the dashboard's Messages page, then emails it to the author (replying to that email
 * answers the visitor). Returns "unavailable" if it can't be saved, so the form asks
 * the visitor to email directly instead of pretending it was sent.
 */
export async function deliverContactMessage(
  message: ContactMessage,
): Promise<"sent" | "unavailable"> {
  try {
    const saved = await db.message.create({
      data: {
        name: message.name,
        email: message.email,
        organization: message.organization || null,
        type: message.type,
        message: message.message,
      },
    });
    after(() => sendEmail(authorMessageEmail(emailConfig.authorEmail, saved)));
    return "sent";
  } catch (error) {
    console.error("[contact] Could not save the message:", error);
    return "unavailable";
  }
}

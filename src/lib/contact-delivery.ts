import "server-only";
import type { ContactMessage } from "@/lib/contact";
import { db } from "@/lib/db";

/**
 * Delivers a validated contact message by saving it to the database, where it shows in
 * the dashboard's Messages page. Returns "unavailable" if it can't be saved, so the
 * form asks the visitor to email directly instead of pretending it was sent.
 */
export async function deliverContactMessage(
  message: ContactMessage,
): Promise<"sent" | "unavailable"> {
  try {
    await db.message.create({
      data: {
        name: message.name,
        email: message.email,
        organization: message.organization || null,
        type: message.type,
        message: message.message,
      },
    });
    return "sent";
  } catch (error) {
    console.error("[contact] Could not save the message:", error);
    return "unavailable";
  }
}

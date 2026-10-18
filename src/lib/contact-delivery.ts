import "server-only";
import type { ContactMessage } from "@/lib/contact";

/**
 * Delivers a validated contact message.
 *
 * NOT CONNECTED YET: no email service or database is set up. Until it is:
 * - in development, the message is printed to the server terminal so the form can be tested;
 * - in production, "unavailable" is returned and the form asks visitors to email directly,
 *   so nobody is told their message was sent when it was not.
 *
 * To connect it, send the message here (e.g. with an email API, or save it for the
 * dashboard's Messages page) and return "sent" on success.
 */
export async function deliverContactMessage(
  message: ContactMessage,
): Promise<"sent" | "unavailable"> {
  if (process.env.NODE_ENV !== "production") {
    console.info("[contact] Message received (not delivered, no service configured):", message);
    return "sent";
  }
  return "unavailable";
}

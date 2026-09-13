"use server";

import { redirect } from "next/navigation";
import { isRateLimited } from "@/lib/rate-limit";

export async function sendContactMessage(formData: FormData) {
  // Honeypot: a real visitor never fills this hidden field. A bot usually
  // does. If it's filled, pretend to succeed and drop the message.
  if (String(formData.get("website") ?? "").trim()) {
    redirect("/contact?sent=1");
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (email && (await isRateLimited("contact", email.toLowerCase(), 5, 60))) {
    redirect("/contact?limited=1");
  }

  const webhookUrl = process.env.ZAPIER_CONTACT_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact_form",
          name,
          email,
          message,
          submitted_at: new Date().toISOString(),
        }),
      });
    } catch {
      // fall through — still redirect so the user isn't stuck; the failure
      // just means the Zap didn't fire this time.
    }
  }

  redirect("/contact?sent=1");
}

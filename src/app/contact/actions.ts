"use server";

import { redirect } from "next/navigation";

export async function sendContactMessage(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

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

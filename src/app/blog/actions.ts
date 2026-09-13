"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isRateLimited } from "@/lib/rate-limit";

export async function subscribeToNewsletter(formData: FormData) {
  if (String(formData.get("website") ?? "").trim()) {
    redirect("/blog?subscribed=1");
  }

  const email = String(formData.get("email") ?? "").trim();
  if (!email) redirect("/blog");

  if (await isRateLimited("newsletter", email.toLowerCase(), 3, 60 * 24)) {
    redirect("/blog?limited=1");
  }

  const supabase = await createClient();
  await supabase.from("newsletter_subscribers").insert({ email }).select().single();

  redirect("/blog?subscribed=1");
}

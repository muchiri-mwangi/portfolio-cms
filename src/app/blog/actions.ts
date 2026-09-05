"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function subscribeToNewsletter(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) redirect("/blog");

  const supabase = await createClient();
  await supabase.from("newsletter_subscribers").insert({ email }).select().single();

  redirect("/blog?subscribed=1");
}

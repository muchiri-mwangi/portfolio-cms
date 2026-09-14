"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isRateLimited } from "@/lib/rate-limit";

export async function requestMagicLink(formData: FormData) {
  // Honeypot
  if (String(formData.get("website") ?? "").trim()) {
    redirect("/account/login?sent=1");
  }

  const email = String(formData.get("email") ?? "").trim();
  if (!email) redirect("/account/login");

  if (await isRateLimited("account_login", email.toLowerCase(), 5, 60)) {
    redirect("/account/login?limited=1");
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${siteUrl}/account/callback` },
  });

  if (error) {
    redirect(`/account/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/account/login?sent=1");
}

export async function logoutAccount() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/account/login");
}

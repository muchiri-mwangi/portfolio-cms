"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();

  const payload = {
    site_name: String(formData.get("site_name") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim(),
    primary_color: String(formData.get("primary_color") ?? "#E63946"),
    accent_color: String(formData.get("accent_color") ?? "#1D3557"),
    dark_mode: formData.get("dark_mode") === "on",
    avatar_url: String(formData.get("avatar_url") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    location: String(formData.get("location") ?? "").trim() || null,
    linkedin_url: String(formData.get("linkedin_url") ?? "").trim() || null,
    github_url: String(formData.get("github_url") ?? "").trim() || null,
  };

  const { error } = await supabase.from("site_settings").update(payload).eq("id", 1);

  if (error) {
    redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

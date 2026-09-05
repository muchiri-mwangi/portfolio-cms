"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { createClient } from "@/lib/supabase/server";

function uniqueSlug(title: string) {
  const base = slugify(title, { lower: true, strict: true });
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

function readServiceFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price_kes: Number(formData.get("price_kes") ?? 0),
    delivery_days: Number(formData.get("delivery_days") ?? 3),
    cover_image_url: String(formData.get("cover_image_url") ?? "") || null,
    published: formData.get("published") === "on",
  };
}

export async function createService(formData: FormData) {
  const supabase = await createClient();
  const fields = readServiceFields(formData);

  const { error, data } = await supabase
    .from("services")
    .insert({ ...fields, slug: uniqueSlug(fields.title) })
    .select("id")
    .single();

  if (error) {
    redirect(`/admin/services/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/services");
  revalidatePath("/admin/services");
  redirect(`/admin/services/${data.id}/edit?saved=1`);
}

export async function updateService(serviceId: string, formData: FormData) {
  const supabase = await createClient();
  const fields = readServiceFields(formData);

  const { error } = await supabase.from("services").update(fields).eq("id", serviceId);

  if (error) {
    redirect(`/admin/services/${serviceId}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/services");
  revalidatePath("/admin/services");
  redirect(`/admin/services/${serviceId}/edit?saved=1`);
}

export async function deleteService(serviceId: string) {
  const supabase = await createClient();
  await supabase.from("services").delete().eq("id", serviceId);
  revalidatePath("/services");
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

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

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const type = String(formData.get("type") ?? "template");
  const price_kes = Number(formData.get("price_kes") ?? 0);
  const cover_image_url = String(formData.get("cover_image_url") ?? "") || null;
  const file_path = String(formData.get("file_path") ?? "") || null;
  const published = formData.get("published") === "on";

  const { error, data } = await supabase
    .from("products")
    .insert({
      title,
      slug: uniqueSlug(title),
      description,
      type,
      price_kes,
      cover_image_url,
      file_path,
      published,
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/admin/products/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/marketplace");
  revalidatePath("/admin/products");
  redirect(`/admin/products/${data.id}/edit?saved=1`);
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const type = String(formData.get("type") ?? "template");
  const price_kes = Number(formData.get("price_kes") ?? 0);
  const cover_image_url = String(formData.get("cover_image_url") ?? "") || null;
  const file_path = String(formData.get("file_path") ?? "") || null;
  const published = formData.get("published") === "on";

  const { error } = await supabase
    .from("products")
    .update({ title, description, type, price_kes, cover_image_url, file_path, published })
    .eq("id", productId);

  if (error) {
    redirect(`/admin/products/${productId}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/marketplace");
  revalidatePath("/admin/products");
  redirect(`/admin/products/${productId}/edit?saved=1`);
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", productId);
  revalidatePath("/marketplace");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

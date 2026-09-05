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

function readProductFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    type: String(formData.get("type") ?? "template"),
    category_id: String(formData.get("category_id") ?? "") || null,
    price_kes: Number(formData.get("price_kes") ?? 0),
    compare_at_price_kes: formData.get("compare_at_price_kes")
      ? Number(formData.get("compare_at_price_kes"))
      : null,
    cover_image_url: String(formData.get("cover_image_url") ?? "") || null,
    file_path: String(formData.get("file_path") ?? "") || null,
    published: formData.get("published") === "on",
  };
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const fields = readProductFields(formData);

  const { error, data } = await supabase
    .from("products")
    .insert({ ...fields, slug: uniqueSlug(fields.title) })
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
  const fields = readProductFields(formData);

  const { error } = await supabase.from("products").update(fields).eq("id", productId);

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

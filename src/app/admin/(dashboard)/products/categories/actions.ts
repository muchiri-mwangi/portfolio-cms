"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { createClient } from "@/lib/supabase/server";

export async function createProductCategory(formData: FormData) {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect("/admin/products/categories");

  const { error } = await supabase
    .from("product_categories")
    .insert({ name, slug: slugify(name, { lower: true, strict: true }) });

  if (error) {
    redirect(`/admin/products/categories?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/products/categories");
  revalidatePath("/marketplace");
  redirect("/admin/products/categories");
}

export async function deleteProductCategory(categoryId: string) {
  const supabase = await createClient();
  await supabase.from("product_categories").delete().eq("id", categoryId);
  revalidatePath("/admin/products/categories");
  revalidatePath("/marketplace");
  redirect("/admin/products/categories");
}

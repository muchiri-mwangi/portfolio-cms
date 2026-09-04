"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { createClient } from "@/lib/supabase/server";

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!name) redirect("/admin/categories");

  const { error } = await supabase
    .from("categories")
    .insert({ name, slug: slugify(name, { lower: true, strict: true }), description });

  if (error) {
    redirect(`/admin/categories?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/blog");
  redirect("/admin/categories");
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", categoryId);
  revalidatePath("/admin/categories");
  revalidatePath("/blog");
  redirect("/admin/categories");
}

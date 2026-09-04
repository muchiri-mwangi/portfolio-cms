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

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "");
  const category_id = String(formData.get("category_id") ?? "") || null;
  const cover_image_url = String(formData.get("cover_image_url") ?? "") || null;
  const published = formData.get("published") === "on";

  const { error, data } = await supabase
    .from("posts")
    .insert({
      title,
      slug: uniqueSlug(title),
      excerpt,
      content,
      category_id,
      cover_image_url,
      published,
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/admin/posts/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect(`/admin/posts/${data.id}/edit?saved=1`);
}

export async function updatePost(postId: string, formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "");
  const category_id = String(formData.get("category_id") ?? "") || null;
  const cover_image_url = String(formData.get("cover_image_url") ?? "") || null;
  const published = formData.get("published") === "on";

  const { error } = await supabase
    .from("posts")
    .update({ title, excerpt, content, category_id, cover_image_url, published })
    .eq("id", postId);

  if (error) {
    redirect(`/admin/posts/${postId}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect(`/admin/posts/${postId}/edit?saved=1`);
}

export async function deletePost(postId: string) {
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", postId);
  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

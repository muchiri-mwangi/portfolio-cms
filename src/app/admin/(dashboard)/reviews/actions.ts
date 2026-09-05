"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function approveReview(reviewId: string) {
  const supabase = await createClient();
  await supabase.from("reviews").update({ approved: true }).eq("id", reviewId);
  revalidatePath("/admin/reviews");
  revalidatePath("/marketplace");
  redirect("/admin/reviews");
}

export async function deleteReview(reviewId: string) {
  const supabase = await createClient();
  await supabase.from("reviews").delete().eq("id", reviewId);
  revalidatePath("/admin/reviews");
  revalidatePath("/marketplace");
  redirect("/admin/reviews");
}

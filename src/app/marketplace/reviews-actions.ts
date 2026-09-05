"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function submitReview(productId: string, productSlug: string, formData: FormData) {
  const reviewer_name = String(formData.get("reviewer_name") ?? "").trim();
  const rating = Number(formData.get("rating") ?? 5);
  const comment = String(formData.get("comment") ?? "").trim() || null;

  if (!reviewer_name || rating < 1 || rating > 5) {
    redirect(`/marketplace/${productSlug}?review_error=1`);
  }

  const supabase = await createClient();
  await supabase.from("reviews").insert({
    product_id: productId,
    reviewer_name,
    rating,
    comment,
    approved: false,
  });

  redirect(`/marketplace/${productSlug}?review_submitted=1`);
}

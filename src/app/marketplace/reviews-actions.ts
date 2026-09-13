"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isRateLimited, getClientIdentifier } from "@/lib/rate-limit";
import { notifyAdmin } from "@/lib/notify";

export async function submitReview(productId: string, productSlug: string, formData: FormData) {
  if (String(formData.get("website") ?? "").trim()) {
    redirect(`/marketplace/${productSlug}?review_submitted=1`);
  }

  const reviewer_name = String(formData.get("reviewer_name") ?? "").trim();
  const rating = Number(formData.get("rating") ?? 5);
  const comment = String(formData.get("comment") ?? "").trim() || null;

  if (!reviewer_name || rating < 1 || rating > 5) {
    redirect(`/marketplace/${productSlug}?review_error=1`);
  }

  const identifier = await getClientIdentifier();
  if (await isRateLimited("review", identifier, 5, 60)) {
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

  await notifyAdmin(`⭐ New review pending approval from ${reviewer_name} (${rating}/5)`, {
    type: "new_review",
    product_id: productId,
    rating,
    comment,
  });

  redirect(`/marketplace/${productSlug}?review_submitted=1`);
}

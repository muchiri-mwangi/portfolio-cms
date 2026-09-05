"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createCoupon(formData: FormData) {
  const supabase = await createClient();

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const percent_off = formData.get("percent_off") ? Number(formData.get("percent_off")) : null;
  const amount_off_kes = formData.get("amount_off_kes") ? Number(formData.get("amount_off_kes")) : null;
  const expires_at = String(formData.get("expires_at") ?? "") || null;
  const max_redemptions = formData.get("max_redemptions") ? Number(formData.get("max_redemptions")) : null;

  if (!code || (!percent_off && !amount_off_kes)) {
    redirect("/admin/discounts?error=Add a code and either a percent or amount off");
  }

  const { error } = await supabase.from("coupons").insert({
    code,
    percent_off,
    amount_off_kes,
    expires_at,
    max_redemptions,
  });

  if (error) {
    redirect(`/admin/discounts?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/discounts");
  redirect("/admin/discounts");
}

export async function toggleCoupon(couponId: string, active: boolean) {
  const supabase = await createClient();
  await supabase.from("coupons").update({ active }).eq("id", couponId);
  revalidatePath("/admin/discounts");
  redirect("/admin/discounts");
}

export async function deleteCoupon(couponId: string) {
  const supabase = await createClient();
  await supabase.from("coupons").delete().eq("id", couponId);
  revalidatePath("/admin/discounts");
  redirect("/admin/discounts");
}

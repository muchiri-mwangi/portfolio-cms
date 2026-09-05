import type { SupabaseClient } from "@supabase/supabase-js";

export async function applyCoupon(
  supabase: SupabaseClient,
  code: string | undefined | null,
  amount: number
): Promise<{ amount: number; couponId: string | null }> {
  if (!code) return { amount, couponId: null };

  const { data: coupon } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .eq("active", true)
    .single();

  if (!coupon) return { amount, couponId: null };
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { amount, couponId: null };
  }
  if (coupon.max_redemptions && coupon.times_redeemed >= coupon.max_redemptions) {
    return { amount, couponId: null };
  }

  let discounted = amount;
  if (coupon.percent_off) {
    discounted = amount - (amount * coupon.percent_off) / 100;
  } else if (coupon.amount_off_kes) {
    discounted = amount - coupon.amount_off_kes;
  }
  discounted = Math.max(0, Math.round(discounted));

  return { amount: discounted, couponId: coupon.id };
}

export async function markCouponRedeemed(supabase: SupabaseClient, couponId: string) {
  const { data: coupon } = await supabase
    .from("coupons")
    .select("times_redeemed")
    .eq("id", couponId)
    .single();
  if (!coupon) return;
  await supabase
    .from("coupons")
    .update({ times_redeemed: coupon.times_redeemed + 1 })
    .eq("id", couponId);
}

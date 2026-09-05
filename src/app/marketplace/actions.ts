"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createIntasendCheckout } from "@/lib/intasend";
import { applyCoupon, markCouponRedeemed } from "@/lib/coupons";

export async function buyProduct(productId: string, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const couponCode = String(formData.get("coupon_code") ?? "").trim();

  if (!email) redirect(`/marketplace`);

  const supabase = createAdminClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (!product) redirect("/marketplace");

  const { amount, couponId } = await applyCoupon(supabase, couponCode, Number(product.price_kes));

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      product_id: product.id,
      buyer_email: email,
      buyer_name: name || null,
      amount,
      currency: "KES",
      status: "pending",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    redirect(`/marketplace/${product.slug}?error=1`);
  }

  if (couponId) await markCouponRedeemed(supabase, couponId);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let checkoutUrl: string | null = null;

  try {
    const checkout = await createIntasendCheckout({
      amount,
      currency: "KES",
      email,
      firstName: name || undefined,
      redirectUrl: `${siteUrl}/marketplace/order/${order.id}`,
      apiRef: `p_${order.id}`,
    });

    await supabase
      .from("orders")
      .update({ intasend_checkout_id: checkout.id })
      .eq("id", order.id);

    checkoutUrl = checkout.url;
  } catch {
    checkoutUrl = null;
  }

  redirect(checkoutUrl ?? `/marketplace/order/${order.id}?setup=1`);
}

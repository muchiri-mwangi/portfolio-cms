"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createIntasendCheckout } from "@/lib/intasend";

export async function orderService(serviceId: string, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const requirements = String(formData.get("requirements") ?? "").trim();

  if (!email) redirect("/services");

  const supabase = createAdminClient();

  const { data: service } = await supabase.from("services").select("*").eq("id", serviceId).single();
  if (!service) redirect("/services");

  const { data: order, error: orderError } = await supabase
    .from("service_orders")
    .insert({
      service_id: service.id,
      buyer_email: email,
      buyer_name: name || null,
      requirements: requirements || null,
      amount: service.price_kes,
      currency: "KES",
      status: "pending",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    redirect(`/services/${service.slug}?error=1`);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let checkoutUrl: string | null = null;

  try {
    const checkout = await createIntasendCheckout({
      amount: Number(service.price_kes),
      currency: "KES",
      email,
      firstName: name || undefined,
      redirectUrl: `${siteUrl}/services/order/${order.id}`,
      apiRef: `s_${order.id}`,
    });

    await supabase
      .from("service_orders")
      .update({ intasend_checkout_id: checkout.id })
      .eq("id", order.id);

    checkoutUrl = checkout.url;
  } catch {
    checkoutUrl = null;
  }

  redirect(checkoutUrl ?? `/services/order/${order.id}?setup=1`);
}

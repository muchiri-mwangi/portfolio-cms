"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateServiceOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();
  const payload: Record<string, unknown> = { status };
  if (status === "delivered") payload.delivered_at = new Date().toISOString();

  await supabase.from("service_orders").update(payload).eq("id", orderId);
  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

export async function deliverServiceOrder(orderId: string, formData: FormData) {
  const supabase = await createClient();

  const delivery_note = String(formData.get("delivery_note") ?? "").trim() || null;
  const delivery_file_path = String(formData.get("delivery_file_path") ?? "").trim() || null;

  await supabase
    .from("service_orders")
    .update({
      delivery_note,
      delivery_file_path,
      status: "delivered",
      delivered_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

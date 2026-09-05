import { createClient } from "@/lib/supabase/server";
import DeliveryUploadForm from "@/components/DeliveryUploadForm";
import type { Order, ServiceOrder } from "@/lib/types";
import { deliverServiceOrder, updateServiceOrderStatus } from "./actions";

export const metadata = { title: "Orders" };

const statusColor: Record<string, string> = {
  pending: "bg-soft text-muted",
  paid: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  delivered: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

export default async function OrdersPage() {
  const supabase = await createClient();

  const [{ data: productOrders }, { data: serviceOrders }] = await Promise.all([
    supabase
      .from("orders")
      .select("*, product:products(title)")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("service_orders")
      .select("*, service:services(title)")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-black">Orders</h1>
      <p className="text-muted mt-1 text-sm">
        Marketplace purchases and service (gig) orders in one place.
      </p>

      <section className="mt-8">
        <h2 className="font-bold">Marketplace orders</h2>
        <div className="mt-3 space-y-2">
          {(productOrders as (Order & { product: { title: string } | null })[] | null)?.map((o) => (
            <div key={o.id} className="border-theme flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="font-semibold">{o.product?.title ?? "Deleted product"}</p>
                <p className="text-muted mt-0.5 text-xs">
                  {o.buyer_name || o.buyer_email} · KES {Number(o.amount).toLocaleString()} ·{" "}
                  {new Date(o.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor[o.status]}`}>
                {o.status}
              </span>
            </div>
          ))}
          {(!productOrders || productOrders.length === 0) && (
            <p className="text-muted py-6 text-center text-sm">No marketplace orders yet.</p>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-bold">Service (gig) orders</h2>
        <div className="mt-3 space-y-3">
          {(serviceOrders as (ServiceOrder & { service: { title: string } | null })[] | null)?.map((o) => (
            <div key={o.id} className="border-theme rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{o.service?.title ?? "Deleted service"}</p>
                  <p className="text-muted mt-0.5 text-xs">
                    {o.buyer_name || o.buyer_email} · KES {Number(o.amount).toLocaleString()} ·{" "}
                    {new Date(o.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor[o.status]}`}>
                  {o.status}
                </span>
              </div>

              {o.requirements && (
                <p className="text-muted mt-2 text-xs">
                  <span className="font-semibold">Brief: </span>
                  {o.requirements}
                </p>
              )}

              {(o.status === "paid" || o.status === "in_progress") && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {o.status === "paid" && (
                    <form action={updateServiceOrderStatus.bind(null, o.id, "in_progress")}>
                      <button type="submit" className="border-theme rounded-lg border px-3 py-1.5 text-xs font-bold">
                        Mark in progress
                      </button>
                    </form>
                  )}
                </div>
              )}

              {(o.status === "paid" || o.status === "in_progress") && (
                <DeliveryUploadForm action={deliverServiceOrder.bind(null, o.id)} />
              )}
            </div>
          ))}
          {(!serviceOrders || serviceOrders.length === 0) && (
            <p className="text-muted py-6 text-center text-sm">No service orders yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

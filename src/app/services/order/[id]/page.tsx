import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, Hammer, AlertTriangle } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Your service order" };

const statusCopy: Record<string, { icon: typeof Clock; title: string; body: string }> = {
  pending: {
    icon: Clock,
    title: "Waiting for payment",
    body: "If you just paid, refresh this page in a moment.",
  },
  paid: {
    icon: CheckCircle2,
    title: "Payment confirmed",
    body: "Your order is queued — work will begin shortly.",
  },
  in_progress: {
    icon: Hammer,
    title: "In progress",
    body: "Your order is being worked on.",
  },
  delivered: {
    icon: CheckCircle2,
    title: "Delivered",
    body: "Your delivery is ready below.",
  },
  completed: {
    icon: CheckCircle2,
    title: "Completed",
    body: "This order is complete. Thanks for your business!",
  },
  failed: {
    icon: AlertTriangle,
    title: "Payment failed",
    body: "That payment didn't go through. You can try ordering again.",
  },
};

export default async function ServiceOrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ setup?: string }>;
}) {
  const { id } = await params;
  const { setup } = await searchParams;
  const supabase = createAdminClient();

  const { data: order } = await supabase.from("service_orders").select("*").eq("id", id).single();
  if (!order) notFound();

  let deliveryUrl: string | null = null;
  if (order.delivery_file_path) {
    const { data: signed } = await supabase.storage
      .from("digital-products")
      .createSignedUrl(order.delivery_file_path, 60 * 60);
    deliveryUrl = signed?.signedUrl ?? null;
  }

  const info = statusCopy[order.status] ?? statusCopy.pending;
  const Icon = info.icon;

  return (
    <div className="mx-auto max-w-lg px-5 py-20 text-center">
      {setup && (
        <p className="mb-6 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
          Checkout isn&apos;t fully configured yet — add your IntaSend API keys to
          accept live payments.
        </p>
      )}

      <Icon className={order.status === "failed" ? "mx-auto text-red-500" : "text-primary mx-auto"} size={48} />
      <h1 className="mt-4 text-2xl font-black">{info.title}</h1>
      <p className="text-muted mt-2">{info.body}</p>

      {(order.status === "delivered" || order.status === "completed") && (
        <div className="border-theme mt-8 rounded-2xl border p-5 text-left">
          {order.delivery_note && (
            <p className="text-sm">
              <span className="font-semibold">Note: </span>
              {order.delivery_note}
            </p>
          )}
          {deliveryUrl ? (
            <a
              href={deliveryUrl}
              className="bg-primary mt-4 inline-block rounded-full px-6 py-2.5 text-sm font-bold text-white"
            >
              Download delivery
            </a>
          ) : (
            <p className="text-muted mt-4 text-sm">
              No file attached — check the note above, or reach out via the contact page.
            </p>
          )}
        </div>
      )}

      {order.status === "failed" && (
        <Link
          href="/services"
          className="bg-primary mt-8 inline-block rounded-full px-8 py-3 text-sm font-bold text-white"
        >
          Back to services
        </Link>
      )}

      {(order.status === "pending" || order.status === "paid" || order.status === "in_progress") && (
        <a
          href={`/services/order/${order.id}`}
          className="border-theme mt-8 inline-block rounded-full border px-8 py-3 text-sm font-bold"
        >
          Refresh
        </a>
      )}
    </div>
  );
}

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin Dashboard" };

const PAID_SERVICE_STATUSES = ["paid", "in_progress", "delivered", "completed"];

type RecentOrder = {
  id: string;
  kind: "product" | "service";
  label: string;
  buyer: string;
  amount: number;
  status: string;
  created_at: string;
};

export default async function AdminHome() {
  const supabase = await createClient();

  const [
    { count: totalPosts },
    { count: publishedPosts },
    { count: pendingReviews },
    { data: paidOrders },
    { data: paidServiceOrders },
    { data: recentOrdersRaw },
    { data: recentServiceOrdersRaw },
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("approved", false),
    supabase.from("orders").select("amount").eq("status", "paid"),
    supabase.from("service_orders").select("amount").in("status", PAID_SERVICE_STATUSES),
    supabase
      .from("orders")
      .select("id, amount, status, buyer_name, buyer_email, created_at, product:products(title)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("service_orders")
      .select("id, amount, status, buyer_name, buyer_email, created_at, service:services(title)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const revenue =
    (paidOrders ?? []).reduce((sum, o) => sum + Number(o.amount), 0) +
    (paidServiceOrders ?? []).reduce((sum, o) => sum + Number(o.amount), 0);

  const needsDelivery = (recentServiceOrdersRaw ?? []).filter(
    (o) => o.status === "paid" || o.status === "in_progress"
  ).length;

  const recentOrders: RecentOrder[] = [
    ...(recentOrdersRaw ?? []).map((o) => ({
      id: o.id,
      kind: "product" as const,
      label: (o.product as unknown as { title?: string } | null)?.title ?? "Product",
      buyer: o.buyer_name || o.buyer_email,
      amount: Number(o.amount),
      status: o.status,
      created_at: o.created_at,
    })),
    ...(recentServiceOrdersRaw ?? []).map((o) => ({
      id: o.id,
      kind: "service" as const,
      label: (o.service as unknown as { title?: string } | null)?.title ?? "Service",
      buyer: o.buyer_name || o.buyer_email,
      amount: Number(o.amount),
      status: o.status,
      created_at: o.created_at,
    })),
  ]
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .slice(0, 5);

  const stats = [
    { label: "Revenue (paid)", value: `KES ${revenue.toLocaleString()}` },
    { label: "Published posts", value: totalPosts != null ? `${publishedPosts ?? 0}/${totalPosts}` : 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black">Dashboard</h1>
      <p className="text-muted mt-1 text-sm">Quick overview of your site.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {stats.map((s) => (
          <div key={s.label} className="border-theme rounded-2xl border p-6">
            <p className="text-3xl font-black">{s.value}</p>
            <p className="text-muted mt-1 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {(Boolean(pendingReviews) || needsDelivery > 0) && (
        <div className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide">Needs your attention</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {Boolean(pendingReviews) && (
              <Link
                href="/admin/reviews"
                className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800"
              >
                {pendingReviews} review{pendingReviews === 1 ? "" : "s"} waiting for approval →
              </Link>
            )}
            {needsDelivery > 0 && (
              <Link
                href="/admin/orders"
                className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800"
              >
                {needsDelivery} service order{needsDelivery === 1 ? "" : "s"} to deliver →
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/posts/new"
          className="bg-primary rounded-full px-5 py-2.5 text-sm font-bold text-white"
        >
          Write a new post
        </Link>
        <Link
          href="/admin/settings"
          className="border-theme rounded-full border px-5 py-2.5 text-sm font-bold"
        >
          Edit theme & bio
        </Link>
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Recent orders</h2>
          <Link href="/admin/orders" className="text-primary text-sm font-semibold">
            View all →
          </Link>
        </div>
        <div className="mt-3 space-y-2">
          {recentOrders.map((o) => (
            <div
              key={`${o.kind}-${o.id}`}
              className="border-theme flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <p className="font-semibold">
                  {o.label}{" "}
                  <span className="text-muted text-xs font-normal">
                    ({o.kind === "product" ? "marketplace" : "service"})
                  </span>
                </p>
                <p className="text-muted mt-0.5 text-xs">
                  {o.buyer} · {new Date(o.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">KES {o.amount.toLocaleString()}</p>
                <p className="text-muted text-xs">{o.status}</p>
              </div>
            </div>
          ))}
          {recentOrders.length === 0 && (
            <p className="text-muted py-6 text-center text-sm">No orders yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

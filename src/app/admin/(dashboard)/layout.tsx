import { createClient } from "@/lib/supabase/server";
import AdminNavShell from "@/components/AdminNavShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const [{ count: pendingReviews }, { data: serviceOrders }] = await Promise.all([
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("approved", false),
    supabase.from("service_orders").select("status").in("status", ["paid", "in_progress"]),
  ]);

  const badges = {
    reviews: pendingReviews ?? 0,
    orders: serviceOrders?.length ?? 0,
  };

  return <AdminNavShell badges={badges}>{children}</AdminNavShell>;
}

import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/data";
import AdminNavShell from "@/components/AdminNavShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const [
    { count: pendingReviews },
    { data: serviceOrders },
    {
      data: { user },
    },
    settings,
  ] = await Promise.all([
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("approved", false),
    supabase.from("service_orders").select("status").in("status", ["paid", "in_progress"]),
    supabase.auth.getUser(),
    getSiteSettings(),
  ]);

  const badges = {
    reviews: pendingReviews ?? 0,
    orders: serviceOrders?.length ?? 0,
  };

  const admin = {
    email: user?.email ?? "",
    avatarUrl: settings.avatar_url,
    siteName: settings.site_name,
  };

  return (
    <AdminNavShell badges={badges} admin={admin}>
      {children}
    </AdminNavShell>
  );
}

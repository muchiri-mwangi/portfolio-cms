import { redirect } from "next/navigation";
import Link from "next/link";
import { Download, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logoutAccount } from "./login/actions";

export const metadata = { title: "My Library" };

const gigStatusLabel: Record<string, string> = {
  pending: "Waiting for payment",
  paid: "Queued",
  in_progress: "In progress",
  delivered: "Delivered",
  completed: "Completed",
  failed: "Payment failed",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) redirect("/account/login");

  const admin = createAdminClient();

  const [{ data: orders }, { data: serviceOrders }] = await Promise.all([
    admin
      .from("orders")
      .select("*, product:products(title, file_path, cover_image_url)")
      .eq("buyer_email", user.email)
      .order("created_at", { ascending: false }),
    admin
      .from("service_orders")
      .select("*, service:services(title)")
      .eq("buyer_email", user.email)
      .order("created_at", { ascending: false }),
  ]);

  const productOrders = await Promise.all(
    (orders ?? []).map(async (o) => {
      let downloadUrl: string | null = null;
      if (o.status === "paid" && o.product?.file_path) {
        const { data: signed } = await admin.storage
          .from("digital-products")
          .createSignedUrl(o.product.file_path, 60 * 60);
        downloadUrl = signed?.signedUrl ?? null;
      }
      return { ...o, downloadUrl };
    })
  );

  const gigOrders = await Promise.all(
    (serviceOrders ?? []).map(async (o) => {
      let downloadUrl: string | null = null;
      if ((o.status === "delivered" || o.status === "completed") && o.delivery_file_path) {
        const { data: signed } = await admin.storage
          .from("digital-products")
          .createSignedUrl(o.delivery_file_path, 60 * 60);
        downloadUrl = signed?.signedUrl ?? null;
      }
      return { ...o, downloadUrl };
    })
  );

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-primary text-sm font-bold uppercase tracking-widest">My Library</p>
          <h1 className="mt-2 text-3xl font-black">Welcome back</h1>
          <p className="text-muted mt-1 text-sm">{user.email}</p>
        </div>
        <form action={logoutAccount}>
          <button type="submit" className="border-theme rounded-full border px-4 py-2 text-sm font-semibold">
            Sign out
          </button>
        </form>
      </div>

      <section className="mt-10">
        <h2 className="font-bold">Purchases</h2>
        <div className="mt-4 space-y-3">
          {productOrders.map((o) => (
            <div key={o.id} className="border-theme flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="font-semibold">{o.product?.title ?? "Product"}</p>
                <p className="text-muted mt-0.5 text-xs">
                  {new Date(o.created_at).toLocaleDateString()} · KES {Number(o.amount).toLocaleString()} ·{" "}
                  {o.status}
                </p>
              </div>
              {o.downloadUrl ? (
                <a
                  href={o.downloadUrl}
                  className="bg-primary flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white"
                >
                  <Download size={14} /> Download
                </a>
              ) : (
                <span className="text-muted flex shrink-0 items-center gap-1.5 text-xs">
                  <Clock size={14} /> {o.status === "pending" ? "Awaiting payment" : "Unavailable"}
                </span>
              )}
            </div>
          ))}
          {productOrders.length === 0 && (
            <p className="text-muted py-6 text-center text-sm">
              No purchases yet — browse the{" "}
              <Link href="/marketplace" className="text-primary font-semibold">
                marketplace
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-bold">Service bookings</h2>
        <div className="mt-4 space-y-3">
          {gigOrders.map((o) => (
            <div key={o.id} className="border-theme rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{o.service?.title ?? "Service"}</p>
                  <p className="text-muted mt-0.5 text-xs">
                    {new Date(o.created_at).toLocaleDateString()} · KES {Number(o.amount).toLocaleString()}
                  </p>
                </div>
                <span className="text-muted text-xs font-semibold">
                  {gigStatusLabel[o.status] ?? o.status}
                </span>
              </div>
              {o.downloadUrl && (
                <a
                  href={o.downloadUrl}
                  className="bg-primary mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white"
                >
                  <Download size={14} /> Download delivery
                </a>
              )}
            </div>
          ))}
          {gigOrders.length === 0 && (
            <p className="text-muted py-6 text-center text-sm">
              No service bookings yet — see{" "}
              <Link href="/services" className="text-primary font-semibold">
                what I offer
              </Link>
              .
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

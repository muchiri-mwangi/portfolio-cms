import { UserCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Customers" };

type CustomerRow = {
  email: string;
  name: string | null;
  orders: number;
  totalSpent: number;
  lastOrder: string;
};

export default async function CustomersPage() {
  const supabase = await createClient();

  const [{ data: orders }, { data: serviceOrders }, { data: accounts }] = await Promise.all([
    supabase.from("orders").select("buyer_email, buyer_name, amount, status, created_at"),
    supabase.from("service_orders").select("buyer_email, buyer_name, amount, status, created_at"),
    supabase.from("profiles").select("email, created_at").eq("role", "customer"),
  ]);

  const combined = [...(orders ?? []), ...(serviceOrders ?? [])];
  const byEmail = new Map<string, CustomerRow>();

  for (const row of combined) {
    const existing = byEmail.get(row.buyer_email);
    const spent = row.status === "paid" || row.status === "delivered" || row.status === "completed" ? Number(row.amount) : 0;
    if (existing) {
      existing.orders += 1;
      existing.totalSpent += spent;
      if (row.created_at > existing.lastOrder) existing.lastOrder = row.created_at;
      if (row.buyer_name) existing.name = row.buyer_name;
    } else {
      byEmail.set(row.buyer_email, {
        email: row.buyer_email,
        name: row.buyer_name,
        orders: 1,
        totalSpent: spent,
        lastOrder: row.created_at,
      });
    }
  }

  const customers = Array.from(byEmail.values()).sort((a, b) => (a.lastOrder < b.lastOrder ? 1 : -1));

  const accountEmails = new Set((accounts ?? []).map((a) => a.email));
  const accountsWithNoPurchase = (accounts ?? [])
    .filter((a) => !byEmail.has(a.email))
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  return (
    <div>
      <h1 className="text-2xl font-black">Customers</h1>
      <p className="text-muted mt-1 text-sm">
        Everyone who's bought a product or booked a service, plus who's created a login.
      </p>

      <section>
        <h2 className="mt-6 text-sm font-bold uppercase tracking-wide">Buyers</h2>
        <div className="mt-3 space-y-2">
          {customers.map((c) => (
            <div key={c.email} className="border-theme flex items-center justify-between rounded-xl border p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{c.name || c.email}</p>
                  {accountEmails.has(c.email) && (
                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-700">
                      <UserCheck size={11} /> Has account
                    </span>
                  )}
                </div>
                <p className="text-muted mt-0.5 text-xs">{c.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">KES {c.totalSpent.toLocaleString()}</p>
                <p className="text-muted text-xs">
                  {c.orders} order{c.orders !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
          {customers.length === 0 && (
            <p className="text-muted py-10 text-center text-sm">No customers yet.</p>
          )}
        </div>
      </section>

      {accountsWithNoPurchase.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-bold uppercase tracking-wide">
            Registered accounts with no purchase yet ({accountsWithNoPurchase.length})
          </h2>
          <div className="mt-3 space-y-2">
            {accountsWithNoPurchase.map((a) => (
              <div key={a.email} className="border-theme flex items-center justify-between rounded-xl border p-4">
                <p className="font-semibold">{a.email}</p>
                <p className="text-muted text-xs">
                  Joined {new Date(a.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

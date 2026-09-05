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

  const [{ data: orders }, { data: serviceOrders }] = await Promise.all([
    supabase.from("orders").select("buyer_email, buyer_name, amount, status, created_at"),
    supabase.from("service_orders").select("buyer_email, buyer_name, amount, status, created_at"),
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

  return (
    <div>
      <h1 className="text-2xl font-black">Customers</h1>
      <p className="text-muted mt-1 text-sm">Everyone who's bought a product or booked a service.</p>

      <div className="mt-6 space-y-2">
        {customers.map((c) => (
          <div key={c.email} className="border-theme flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="font-semibold">{c.name || c.email}</p>
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
    </div>
  );
}

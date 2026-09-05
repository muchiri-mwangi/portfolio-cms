import { createClient } from "@/lib/supabase/server";
import type { Coupon } from "@/lib/types";
import { createCoupon, toggleCoupon, deleteCoupon } from "./actions";

export const metadata = { title: "Discounts" };

export default async function DiscountsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
  const coupons = (data ?? []) as Coupon[];

  return (
    <div>
      <h1 className="text-2xl font-black">Discounts</h1>
      <p className="text-muted mt-1 text-sm">
        Create a code, share it, and buyers enter it at checkout on any product.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <form action={createCoupon} className="border-theme mt-6 grid gap-3 rounded-2xl border p-4 sm:grid-cols-2">
        <input
          name="code"
          placeholder="CODE (e.g. LAUNCH20)"
          required
          className="border-theme rounded-lg border px-4 py-2 text-sm outline-none focus:border-primary sm:col-span-2"
        />
        <input
          name="percent_off"
          type="number"
          min="1"
          max="100"
          placeholder="% off (e.g. 20)"
          className="border-theme rounded-lg border px-4 py-2 text-sm outline-none focus:border-primary"
        />
        <input
          name="amount_off_kes"
          type="number"
          min="1"
          placeholder="or KES off (e.g. 200)"
          className="border-theme rounded-lg border px-4 py-2 text-sm outline-none focus:border-primary"
        />
        <input
          name="expires_at"
          type="date"
          className="border-theme rounded-lg border px-4 py-2 text-sm outline-none focus:border-primary"
        />
        <input
          name="max_redemptions"
          type="number"
          min="1"
          placeholder="Max uses (optional)"
          className="border-theme rounded-lg border px-4 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="bg-primary rounded-lg px-5 py-2 text-sm font-bold text-white sm:col-span-2"
        >
          Create discount code
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {coupons.map((c) => (
          <div key={c.id} className="border-theme flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="font-mono font-bold">{c.code}</p>
              <p className="text-muted mt-0.5 text-xs">
                {c.percent_off ? `${c.percent_off}% off` : `KES ${c.amount_off_kes} off`}
                {c.expires_at ? ` · expires ${new Date(c.expires_at).toLocaleDateString()}` : ""}
                {c.max_redemptions ? ` · ${c.times_redeemed}/${c.max_redemptions} used` : ` · ${c.times_redeemed} used`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <form action={toggleCoupon.bind(null, c.id, !c.active)}>
                <button
                  type="submit"
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    c.active ? "bg-green-100 text-green-700" : "bg-soft text-muted"
                  }`}
                >
                  {c.active ? "Active" : "Paused"}
                </button>
              </form>
              <form action={deleteCoupon.bind(null, c.id)}>
                <button type="submit" className="text-xs font-semibold text-red-600">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {coupons.length === 0 && (
          <p className="text-muted py-6 text-center text-sm">No discount codes yet.</p>
        )}
      </div>
    </div>
  );
}

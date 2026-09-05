import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Product, Review } from "@/lib/types";
import { approveReview, deleteReview } from "./actions";

export const metadata = { title: "Reviews" };

export default async function ReviewsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*, product:products(title)")
    .order("created_at", { ascending: false });

  const reviews = (data ?? []) as (Review & { product: Pick<Product, "title"> | null })[];
  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);

  const renderReview = (r: (typeof reviews)[number]) => (
    <div key={r.id} className="border-theme rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted"} />
            ))}
          </div>
          <span className="text-sm font-semibold">{r.reviewer_name}</span>
        </div>
        <span className="text-muted text-xs">{r.product?.title ?? "Deleted product"}</span>
      </div>
      {r.comment && <p className="text-muted mt-2 text-sm">{r.comment}</p>}
      <div className="mt-3 flex gap-2">
        {!r.approved && (
          <form action={approveReview.bind(null, r.id)}>
            <button type="submit" className="bg-primary rounded-lg px-3 py-1.5 text-xs font-bold text-white">
              Approve
            </button>
          </form>
        )}
        <form action={deleteReview.bind(null, r.id)}>
          <button type="submit" className="border-theme rounded-lg border px-3 py-1.5 text-xs font-bold text-red-600">
            Delete
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-black">Reviews</h1>
      <p className="text-muted mt-1 text-sm">Approve reviews before they show on a product page.</p>

      <section className="mt-8">
        <h2 className="font-bold">Pending ({pending.length})</h2>
        <div className="mt-3 space-y-3">
          {pending.map(renderReview)}
          {pending.length === 0 && <p className="text-muted py-4 text-sm">Nothing waiting.</p>}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-bold">Approved ({approved.length})</h2>
        <div className="mt-3 space-y-3">
          {approved.map(renderReview)}
          {approved.length === 0 && <p className="text-muted py-4 text-sm">None yet.</p>}
        </div>
      </section>
    </div>
  );
}

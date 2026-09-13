import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Pagination from "@/components/Pagination";
import type { Product } from "@/lib/types";

export const metadata = { title: "Manage Products" };

const PAGE_SIZE = 20;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const from = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();
  const { data, count } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  const products = (data ?? []) as Product[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-primary rounded-full px-5 py-2.5 text-sm font-bold text-white"
        >
          New product
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/admin/products/${p.id}/edit`}
            className="border-theme hover:border-primary flex items-center justify-between rounded-xl border p-4"
          >
            <div>
              <p className="font-semibold">{p.title}</p>
              <p className="text-muted mt-0.5 text-xs">
                {p.type} · KES {Number(p.price_kes).toLocaleString()}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                p.published ? "bg-green-100 text-green-700" : "bg-soft text-muted"
              }`}
            >
              {p.published ? "Live" : "Draft"}
            </span>
          </Link>
        ))}

        {products.length === 0 && (
          <p className="text-muted py-10 text-center text-sm">
            No products yet. Add your first template or ebook.
          </p>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/products" />
    </div>
  );
}

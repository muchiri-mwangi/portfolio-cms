import { getProductCategories } from "@/lib/data";
import { createProductCategory, deleteProductCategory } from "./actions";

export const metadata = { title: "Marketplace Categories" };

export default async function ProductCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const categories = await getProductCategories();

  return (
    <div>
      <h1 className="text-2xl font-black">Marketplace categories</h1>
      <p className="text-muted mt-1 text-sm">Group your products so buyers can filter by category.</p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <form action={createProductCategory} className="border-theme mt-6 flex flex-wrap gap-3 rounded-2xl border p-4">
        <input
          name="name"
          placeholder="Category name"
          required
          className="border-theme flex-1 rounded-lg border px-4 py-2 text-sm outline-none focus:border-primary"
        />
        <button type="submit" className="bg-primary rounded-lg px-5 py-2 text-sm font-bold text-white">
          Add
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {categories.map((c) => (
          <div key={c.id} className="border-theme flex items-center justify-between rounded-xl border p-4">
            <p className="font-semibold">{c.name}</p>
            <form action={deleteProductCategory.bind(null, c.id)}>
              <button type="submit" className="text-xs font-semibold text-red-600">
                Delete
              </button>
            </form>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-muted py-6 text-center text-sm">No categories yet.</p>
        )}
      </div>
    </div>
  );
}

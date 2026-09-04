import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";
import { createCategory, deleteCategory } from "./actions";

export const metadata = { title: "Manage Categories" };

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  const categories = (data ?? []) as Category[];

  return (
    <div>
      <h1 className="text-2xl font-black">Categories</h1>
      <p className="text-muted mt-1 text-sm">
        These are your field categories — used to group blog posts.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <form action={createCategory} className="border-theme mt-6 flex flex-wrap gap-3 rounded-2xl border p-4">
        <input
          name="name"
          placeholder="Category name"
          required
          className="border-theme flex-1 rounded-lg border px-4 py-2 text-sm outline-none focus:border-primary"
        />
        <input
          name="description"
          placeholder="Short description (optional)"
          className="border-theme flex-[2] rounded-lg border px-4 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="bg-primary rounded-lg px-5 py-2 text-sm font-bold text-white"
        >
          Add
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {categories.map((c) => (
          <div
            key={c.id}
            className="border-theme flex items-center justify-between rounded-xl border p-4"
          >
            <div>
              <p className="font-semibold">{c.name}</p>
              {c.description && <p className="text-muted text-xs">{c.description}</p>}
            </div>
            <form action={deleteCategory.bind(null, c.id)}>
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

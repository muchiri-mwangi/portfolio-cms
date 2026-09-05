import ProductForm from "@/components/ProductForm";
import { getProductCategories } from "@/lib/data";
import { createProduct } from "../actions";

export const metadata = { title: "New Product" };

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const categories = await getProductCategories();

  return (
    <div>
      <h1 className="text-2xl font-black">New product</h1>
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}
      <div className="mt-6 max-w-2xl">
        <ProductForm categories={categories} action={createProduct} />
      </div>
    </div>
  );
}

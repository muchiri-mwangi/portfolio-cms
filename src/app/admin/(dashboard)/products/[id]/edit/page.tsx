import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProductCategories } from "@/lib/data";
import ProductForm from "@/components/ProductForm";
import ConfirmDeleteButton from "@/components/ConfirmDeleteButton";
import { updateProduct, deleteProduct } from "../../actions";
import type { Product } from "@/lib/types";

export const metadata = { title: "Edit Product" };

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;

  const supabase = await createClient();
  const [{ data: product }, categories] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    getProductCategories(),
  ]);

  if (!product) notFound();

  const updateProductWithId = updateProduct.bind(null, id);
  const deleteProductWithId = deleteProduct.bind(null, id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Edit product</h1>
        <ConfirmDeleteButton
          action={deleteProductWithId}
          label="Delete product"
          confirmText={`Delete "${product.title}"? This can't be undone.`}
        />
      </div>

      {saved && (
        <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">Saved.</p>
      )}
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-6 max-w-2xl">
        <ProductForm product={product as Product} categories={categories} action={updateProductWithId} />
      </div>
    </div>
  );
}

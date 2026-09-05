import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data";
import { buyProduct } from "../actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.title ?? "Product not found" };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  const { error } = await searchParams;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const buyWithProduct = buyProduct.bind(null, product.id);

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="bg-soft aspect-square overflow-hidden rounded-2xl">
          {product.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.cover_image_url}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="bg-accent/10 flex h-full w-full items-center justify-center text-6xl font-black text-accent/30">
              {product.title.charAt(0)}
            </div>
          )}
        </div>

        <div>
          <span className="text-primary text-xs font-bold uppercase tracking-wide">
            {product.type === "ebook" ? "Ebook" : "Template"}
          </span>
          <h1 className="mt-2 text-3xl font-black">{product.title}</h1>
          <p className="mt-4 text-2xl font-black">
            KES {Number(product.price_kes).toLocaleString()}
          </p>
          <p className="text-muted prose-content mt-4">{product.description}</p>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              Something went wrong creating your order — please try again.
            </p>
          )}

          <form action={buyWithProduct} className="border-theme mt-8 space-y-4 rounded-2xl border p-5">
            <div>
              <label className="text-sm font-semibold" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="email">
                Email (your download link goes here)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="bg-primary w-full rounded-full py-3 text-sm font-bold text-white"
            >
              Buy now — pay via M-Pesa or card
            </button>
            <p className="text-muted text-center text-xs">Secure checkout powered by IntaSend</p>
          </form>
        </div>
      </div>
    </div>
  );
}

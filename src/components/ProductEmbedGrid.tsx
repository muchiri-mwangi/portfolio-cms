import Link from "next/link";
import { getProductsForEmbed } from "@/lib/data";

export default async function ProductEmbedGrid({
  categorySlug,
  limit,
}: {
  categorySlug: string;
  limit: number;
}) {
  const products = await getProductsForEmbed(categorySlug, limit);
  if (products.length === 0) return null;

  return (
    <div className="bg-soft not-prose my-8 rounded-2xl p-5">
      <p className="text-muted mb-3 text-xs font-bold uppercase tracking-wide">You might also like</p>
      <div className="grid gap-4 sm:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/marketplace/${p.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl bg-[var(--color-bg)]"
          >
            <div className="bg-soft aspect-[4/3] overflow-hidden">
              {p.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.cover_image_url}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="bg-accent/10 flex h-full w-full items-center justify-center text-2xl font-black text-accent/30">
                  {p.title.charAt(0)}
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-bold group-hover:text-primary">{p.title}</p>
              <p className="mt-1 text-xs font-black">KES {Number(p.price_kes).toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

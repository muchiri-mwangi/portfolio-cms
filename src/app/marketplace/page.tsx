import Link from "next/link";
import { getProductCategories, getPublishedProducts } from "@/lib/data";

export const metadata = { title: "Marketplace" };

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([
    getPublishedProducts(category),
    getProductCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-primary text-sm font-bold uppercase tracking-widest">Marketplace</p>
      <h1 className="mt-2 text-4xl font-black">Templates & ebooks</h1>
      <p className="text-muted mt-4 max-w-2xl text-lg">
        Digital products built from real project experience. Instant download after payment.
      </p>

      {categories.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/marketplace"
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
              !category ? "bg-primary border-primary text-white" : "border-theme text-muted hover:border-primary hover:text-primary"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/marketplace?category=${c.slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
                category === c.slug ? "bg-primary border-primary text-white" : "border-theme text-muted hover:border-primary hover:text-primary"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/marketplace/${p.slug}`}
            className="group border-theme relative flex flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-lg"
          >
            {p.compare_at_price_kes && (
              <span className="bg-primary absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-xs font-bold text-white">
                Sale
              </span>
            )}
            <div className="bg-soft relative aspect-[4/3] w-full overflow-hidden">
              {p.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.cover_image_url}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="bg-accent/10 flex h-full w-full items-center justify-center text-4xl font-black text-accent/30">
                  {p.title.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <span className="text-primary text-xs font-bold uppercase tracking-wide">
                {p.category?.name || (p.type === "ebook" ? "Ebook" : "Template")}
              </span>
              <h3 className="font-bold group-hover:text-primary">{p.title}</h3>
              <p className="text-muted line-clamp-2 text-sm">{p.description}</p>
              <div className="mt-auto flex items-baseline gap-2 pt-2">
                <span className="font-black">KES {Number(p.price_kes).toLocaleString()}</span>
                {p.compare_at_price_kes && (
                  <span className="text-muted text-sm line-through">
                    KES {Number(p.compare_at_price_kes).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-muted mt-16 text-center">
          Nothing for sale yet — check back soon.
        </p>
      )}
    </div>
  );
}

import Link from "next/link";
import { getPublishedProducts } from "@/lib/data";

export const metadata = { title: "Marketplace" };

export default async function MarketplacePage() {
  const products = await getPublishedProducts();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-primary text-sm font-bold uppercase tracking-widest">Marketplace</p>
      <h1 className="mt-2 text-4xl font-black">Templates & ebooks</h1>
      <p className="text-muted mt-4 max-w-2xl text-lg">
        Digital products built from real project experience. Instant download after payment.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/marketplace/${p.slug}`}
            className="group border-theme flex flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-lg"
          >
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
                {p.type === "ebook" ? "Ebook" : "Template"}
              </span>
              <h3 className="font-bold group-hover:text-primary">{p.title}</h3>
              <p className="text-muted line-clamp-2 text-sm">{p.description}</p>
              <span className="mt-auto pt-2 font-black">
                KES {Number(p.price_kes).toLocaleString()}
              </span>
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

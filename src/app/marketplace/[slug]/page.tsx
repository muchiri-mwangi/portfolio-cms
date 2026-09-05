import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { getApprovedReviews, getProductBySlug } from "@/lib/data";
import { buyProduct } from "../actions";
import { submitReview } from "../reviews-actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: product.cover_image_url ? [product.cover_image_url] : undefined,
      type: "website",
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; review_submitted?: string; review_error?: string }>;
}) {
  const { slug } = await params;
  const { error, review_submitted, review_error } = await searchParams;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const reviews = await getApprovedReviews(product.id);
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  const buyWithProduct = buyProduct.bind(null, product.id);
  const submitReviewForProduct = submitReview.bind(null, product.id, product.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.cover_image_url || undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: product.price_kes,
      availability: "https://schema.org/InStock",
    },
    ...(avgRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating.toFixed(1),
            reviewCount: reviews.length,
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            {product.category?.name || (product.type === "ebook" ? "Ebook" : "Template")}
          </span>
          <h1 className="mt-2 text-3xl font-black">{product.title}</h1>

          {avgRating && (
            <div className="mt-2 flex items-center gap-1.5">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold">{avgRating.toFixed(1)}</span>
              <span className="text-muted text-sm">({reviews.length} reviews)</span>
            </div>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            <p className="text-2xl font-black">
              KES {Number(product.price_kes).toLocaleString()}
            </p>
            {product.compare_at_price_kes && (
              <p className="text-muted text-lg line-through">
                KES {Number(product.compare_at_price_kes).toLocaleString()}
              </p>
            )}
          </div>
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
            <div>
              <label className="text-sm font-semibold" htmlFor="coupon_code">
                Discount code (optional)
              </label>
              <input
                id="coupon_code"
                name="coupon_code"
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

      {/* Reviews */}
      <div className="border-theme mt-16 border-t pt-10">
        <h2 className="text-xl font-black">Reviews</h2>

        {review_submitted && (
          <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            Thanks — your review will show once it's approved.
          </p>
        )}
        {review_error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            Please add your name and a rating.
          </p>
        )}

        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="border-theme rounded-xl border p-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted"}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold">{r.reviewer_name}</span>
                </div>
                {r.comment && <p className="text-muted mt-2 text-sm">{r.comment}</p>}
              </div>
            ))}
            {reviews.length === 0 && (
              <p className="text-muted text-sm">No reviews yet — be the first.</p>
            )}
          </div>

          <form action={submitReviewForProduct} className="border-theme h-fit space-y-3 rounded-2xl border p-5">
            <p className="text-sm font-semibold">Leave a review</p>
            <input
              name="reviewer_name"
              placeholder="Your name"
              required
              className="border-theme w-full rounded-lg border px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <select
              name="rating"
              defaultValue="5"
              className="border-theme w-full rounded-lg border px-4 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="5">5 — excellent</option>
              <option value="4">4 — good</option>
              <option value="3">3 — okay</option>
              <option value="2">2 — not great</option>
              <option value="1">1 — poor</option>
            </select>
            <textarea
              name="comment"
              rows={3}
              placeholder="What did you think? (optional)"
              className="border-theme w-full rounded-lg border px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="border-theme w-full rounded-lg border py-2 text-sm font-bold"
            >
              Submit review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

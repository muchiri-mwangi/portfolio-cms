import Link from "next/link";
import { getCategories, getPublishedPosts, getSiteSettings } from "@/lib/data";
import PostCard from "@/components/PostCard";
import { subscribeToNewsletter } from "./actions";

export const revalidate = 60;

export const metadata = { title: "Blog" };

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; subscribed?: string }>;
}) {
  const { category, subscribed } = await searchParams;
  const [posts, categories, settings] = await Promise.all([
    getPublishedPosts(category),
    getCategories(),
    getSiteSettings(),
  ]);

  const [featured, ...rest] = posts;
  const recent = posts.slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-primary text-sm font-bold uppercase tracking-widest">Blog</p>
      <h1 className="mt-2 text-4xl font-black">{settings.blog_name}</h1>
      <p className="text-muted mt-4 max-w-2xl text-lg">
        Writing on networking, AI data annotation, and building software in Kenya.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_300px]">
        {/* Main column */}
        <div>
          {categories.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              <Link
                href="/blog"
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
                  !category ? "bg-primary border-primary text-white" : "border-theme text-muted hover:border-primary hover:text-primary"
                }`}
              >
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/blog?category=${c.slug}`}
                  className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
                    category === c.slug ? "bg-primary border-primary text-white" : "border-theme text-muted hover:border-primary hover:text-primary"
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}

          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="border-theme group mb-10 grid overflow-hidden rounded-2xl border md:grid-cols-2"
            >
              <div className="bg-soft relative aspect-[16/9] md:aspect-auto">
                {featured.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featured.cover_image_url}
                    alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="bg-accent/10 flex h-full w-full items-center justify-center text-6xl font-black text-accent/30">
                    {featured.title.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8">
                {featured.category && (
                  <span className="text-primary text-xs font-bold uppercase tracking-wide">
                    {featured.category.name}
                  </span>
                )}
                <h2 className="mt-2 text-2xl font-black leading-snug group-hover:text-primary">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="text-muted mt-3 line-clamp-3">{featured.excerpt}</p>
                )}
                <span className="text-primary mt-4 text-sm font-semibold">Read more →</span>
              </div>
            </Link>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {rest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {posts.length === 0 && (
            <p className="text-muted mt-16 text-center">
              No posts yet — check back soon, or log in to the admin dashboard to publish your first one.
            </p>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="border-theme rounded-2xl border p-5">
            <h3 className="font-bold">Get new posts by email</h3>
            <p className="text-muted mt-1 text-sm">
              No spam — just new articles as they're published.
            </p>
            {subscribed && (
              <p className="mt-3 rounded-lg bg-green-50 p-2 text-xs text-green-700">
                Subscribed — thanks!
              </p>
            )}
            <form action={subscribeToNewsletter} className="mt-4 flex gap-2">
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="border-theme min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="bg-primary shrink-0 rounded-lg px-4 py-2 text-sm font-bold text-white"
              >
                Subscribe
              </button>
            </form>
          </div>

          {categories.length > 0 && (
            <div className="border-theme rounded-2xl border p-5">
              <h3 className="font-bold">Categories</h3>
              <ul className="mt-3 space-y-2">
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/blog?category=${c.slug}`}
                      className="text-muted hover:text-primary text-sm"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recent.length > 0 && (
            <div className="border-theme rounded-2xl border p-5">
              <h3 className="font-bold">Recent posts</h3>
              <ul className="mt-3 space-y-3">
                {recent.map((p) => (
                  <li key={p.id}>
                    <Link href={`/blog/${p.slug}`} className="hover:text-primary text-sm font-medium">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

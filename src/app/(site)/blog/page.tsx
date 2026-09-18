import Link from "next/link";
import Image from "next/image";
import {
  getCategories,
  getPublishedPosts,
  getPublishedPostsPage,
  getSiteSettings,
  POSTS_PAGE_SIZE,
} from "@/lib/data";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { subscribeToNewsletter } from "./actions";
import HoneypotField from "@/components/HoneypotField";

export const revalidate = 60;

export const metadata = { title: "Blog" };

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; subscribed?: string; limited?: string; page?: string }>;
}) {
  const { category, subscribed, limited, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [{ items: posts, total }, categories, settings, allPosts] = await Promise.all([
    getPublishedPostsPage(category, page),
    getCategories(),
    getSiteSettings(),
    getPublishedPosts(), // full list, cached — used for the "recent" sidebar only
  ]);

  const totalPages = Math.max(1, Math.ceil(total / POSTS_PAGE_SIZE));
  const featured = page === 1 ? posts[0] : undefined;
  const rest = page === 1 ? posts.slice(1) : posts;
  const recent = allPosts.slice(0, 5);

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
                  <Image
                    src={featured.cover_image_url}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
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

          <Pagination
            page={page}
            totalPages={totalPages}
            basePath="/blog"
            searchParams={{ category }}
          />
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
            {limited && (
              <p className="mt-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-700">
                You&apos;ve already subscribed recently — thanks for the enthusiasm!
              </p>
            )}
            <form action={subscribeToNewsletter} className="mt-4 flex gap-2">
              <HoneypotField />
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

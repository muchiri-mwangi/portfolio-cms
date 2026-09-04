import { getCategories, getPublishedPosts } from "@/lib/data";
import PostCard from "@/components/PostCard";
import CategoryPill from "@/components/CategoryPill";

export const metadata = { title: "Blog" };

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [posts, categories] = await Promise.all([
    getPublishedPosts(category),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-primary text-sm font-bold uppercase tracking-widest">Blog</p>
      <h1 className="mt-2 text-4xl font-black">Notes from the field</h1>
      <p className="text-muted mt-4 max-w-2xl text-lg">
        Writing on networking, AI data annotation, and building software in Kenya.
      </p>

      {categories.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <CategoryPill name="All" active={!category} />
          {categories.map((c) => (
            <CategoryPill
              key={c.id}
              name={c.name}
              slug={c.slug}
              active={category === c.slug}
            />
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-muted mt-16 text-center">
          No posts yet — check back soon, or log in to the admin dashboard to publish your first one.
        </p>
      )}
    </div>
  );
}

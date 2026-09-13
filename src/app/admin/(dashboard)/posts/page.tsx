import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Pagination from "@/components/Pagination";
import type { Post } from "@/lib/types";

export const metadata = { title: "Manage Posts" };

const PAGE_SIZE = 20;

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const from = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();
  const { data, count } = await supabase
    .from("posts")
    .select("*, category:categories(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  const posts = (data ?? []) as Post[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="bg-primary rounded-full px-5 py-2.5 text-sm font-bold text-white"
        >
          New post
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/admin/posts/${post.id}/edit`}
            className="border-theme hover:border-primary flex items-center justify-between rounded-xl border p-4"
          >
            <div>
              <p className="font-semibold">{post.title}</p>
              <p className="text-muted mt-0.5 text-xs">
                {post.category?.name ?? "Uncategorized"} ·{" "}
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                post.published ? "bg-green-100 text-green-700" : "bg-soft text-muted"
              }`}
            >
              {post.published ? "Published" : "Draft"}
            </span>
          </Link>
        ))}

        {posts.length === 0 && (
          <p className="text-muted py-10 text-center text-sm">
            No posts yet. Create your first one.
          </p>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/posts" />
    </div>
  );
}

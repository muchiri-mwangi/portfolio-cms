import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";

export const metadata = { title: "Manage Posts" };

export default async function AdminPostsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false });

  const posts = (data ?? []) as Post[];

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
    </div>
  );
}

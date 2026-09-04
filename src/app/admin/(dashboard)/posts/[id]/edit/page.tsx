import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/data";
import PostForm from "@/components/PostForm";
import { updatePost, deletePost } from "../../actions";
import type { Post } from "@/lib/types";

export const metadata = { title: "Edit Post" };

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;

  const supabase = await createClient();
  const [{ data: post }, categories] = await Promise.all([
    supabase.from("posts").select("*").eq("id", id).single(),
    getCategories(),
  ]);

  if (!post) notFound();

  const updatePostWithId = updatePost.bind(null, id);
  const deletePostWithId = deletePost.bind(null, id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Edit post</h1>
        <form action={deletePostWithId}>
          <button type="submit" className="text-xs font-semibold text-red-600">
            Delete post
          </button>
        </form>
      </div>

      {saved && (
        <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          Saved.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-6 max-w-2xl">
        <PostForm post={post as Post} categories={categories} action={updatePostWithId} />
      </div>
    </div>
  );
}

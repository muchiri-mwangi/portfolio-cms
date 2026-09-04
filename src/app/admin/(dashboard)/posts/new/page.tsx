import { getCategories } from "@/lib/data";
import PostForm from "@/components/PostForm";
import { createPost } from "../actions";

export const metadata = { title: "New Post" };

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-2xl font-black">New post</h1>
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}
      <div className="mt-6 max-w-2xl">
        <PostForm categories={categories} action={createPost} />
      </div>
    </div>
  );
}

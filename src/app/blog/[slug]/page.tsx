import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return { title: post?.title ?? "Post not found" };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <Link href="/blog" className="text-primary text-sm font-semibold">
        ← Back to blog
      </Link>

      {post.category && (
        <p className="text-primary mt-6 text-sm font-bold uppercase tracking-widest">
          {post.category.name}
        </p>
      )}
      <h1 className="mt-2 text-4xl font-black leading-tight">{post.title}</h1>
      <p className="text-muted mt-3 text-sm">{date}</p>

      {post.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="mt-8 w-full rounded-2xl object-cover"
        />
      )}

      <div className="prose-content mt-10">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}

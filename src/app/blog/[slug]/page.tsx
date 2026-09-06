import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug } from "@/lib/data";
import { parsePostContent } from "@/lib/post-content";
import ProductEmbedGrid from "@/components/ProductEmbedGrid";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
      type: "article",
    },
  };
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

  const segments = parsePostContent(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    image: post.cover_image_url || undefined,
  };

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
        {segments.map((segment, i) =>
          segment.type === "markdown" ? (
            <ReactMarkdown key={i} remarkPlugins={[remarkGfm]}>
              {segment.value}
            </ReactMarkdown>
          ) : (
            <ProductEmbedGrid key={i} categorySlug={segment.categorySlug} limit={segment.limit} />
          )
        )}
      </div>
    </article>
  );
}

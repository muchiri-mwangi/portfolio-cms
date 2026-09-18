import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getPostBySlug } from "@/lib/data";
import { parsePostContent } from "@/lib/post-content";
import { extractHeadings } from "@/lib/toc";
import ProductEmbedGrid from "@/components/ProductEmbedGrid";
import TableOfContents from "@/components/TableOfContents";

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
  const headings = extractHeadings(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    image: post.cover_image_url || undefined,
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
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
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            sizes="960px"
            className="object-cover"
          />
        </div>
      )}

      {/* Mobile: collapsible "On this page" above the content */}
      {headings.length >= 2 && (
        <details className="border-theme mt-8 rounded-xl border p-4 lg:hidden">
          <summary className="cursor-pointer text-sm font-bold">On this page</summary>
          <div className="mt-3">
            <TableOfContents headings={headings} />
          </div>
        </details>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_240px]">
        <article className="prose-content max-w-3xl">
          {segments.map((segment, i) =>
            segment.type === "markdown" ? (
              <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
                {segment.value}
              </ReactMarkdown>
            ) : (
              <ProductEmbedGrid key={i} categorySlug={segment.categorySlug} limit={segment.limit} />
            )
          )}
        </article>

        {/* Desktop: sticky sidebar TOC */}
        {headings.length >= 2 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

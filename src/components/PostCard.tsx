import Link from "next/link";
import type { Post } from "@/lib/types";

export default function PostCard({ post }: { post: Post }) {
  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group border-theme flex flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-lg"
    >
      <div className="bg-soft relative aspect-[16/9] w-full overflow-hidden">
        {post.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="bg-accent/10 flex h-full w-full items-center justify-center text-4xl font-black text-accent/30">
            {post.title.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {post.category && (
          <span className="text-primary text-xs font-bold uppercase tracking-wide">
            {post.category.name}
          </span>
        )}
        <h3 className="text-lg font-bold leading-snug group-hover:text-primary">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-muted line-clamp-2 text-sm">{post.excerpt}</p>
        )}
        <span className="text-muted mt-auto pt-2 text-xs">{date}</span>
      </div>
    </Link>
  );
}

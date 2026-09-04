import Link from "next/link";

export default function CategoryPill({
  name,
  slug,
  active,
}: {
  name: string;
  slug?: string;
  active?: boolean;
}) {
  return (
    <Link
      href={slug ? `/blog?category=${slug}` : "/blog"}
      className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
        active
          ? "bg-primary border-primary text-white"
          : "border-theme text-muted hover:border-primary hover:text-primary"
      }`}
    >
      {name}
    </Link>
  );
}

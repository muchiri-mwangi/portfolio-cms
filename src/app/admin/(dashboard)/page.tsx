import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminHome() {
  const supabase = await createClient();

  const [{ count: totalPosts }, { count: publishedPosts }, { count: totalCategories }] =
    await Promise.all([
      supabase.from("posts").select("*", { count: "exact", head: true }),
      supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("published", true),
      supabase.from("categories").select("*", { count: "exact", head: true }),
    ]);

  const stats = [
    { label: "Total posts", value: totalPosts ?? 0 },
    { label: "Published", value: publishedPosts ?? 0 },
    { label: "Categories", value: totalCategories ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black">Dashboard</h1>
      <p className="text-muted mt-1 text-sm">Quick overview of your site.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="border-theme rounded-2xl border p-6">
            <p className="text-3xl font-black">{s.value}</p>
            <p className="text-muted mt-1 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/posts/new"
          className="bg-primary rounded-full px-5 py-2.5 text-sm font-bold text-white"
        >
          Write a new post
        </Link>
        <Link
          href="/admin/settings"
          className="border-theme rounded-full border px-5 py-2.5 text-sm font-bold"
        >
          Edit theme & bio
        </Link>
      </div>
    </div>
  );
}

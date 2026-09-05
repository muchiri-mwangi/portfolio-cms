import Link from "next/link";
import { LayoutDashboard, FileText, Tags, Palette, ExternalLink, ShoppingBag } from "lucide-react";
import { logout } from "../login/actions";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/settings", label: "Theme & Settings", icon: Palette },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-5 py-10">
      <aside className="border-theme sticky top-24 hidden h-fit w-56 shrink-0 rounded-2xl border p-4 md:block">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted hover:bg-soft hover:text-primary flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-theme mt-4 flex flex-col gap-1 border-t pt-4">
          <Link
            href="/"
            target="_blank"
            className="text-muted hover:text-primary flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
          >
            <ExternalLink size={16} />
            View site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-muted hover:text-primary w-full rounded-lg px-3 py-2 text-left text-sm font-medium"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

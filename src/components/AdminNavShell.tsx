"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Tags,
  Palette,
  ExternalLink,
  ShoppingBag,
  Briefcase,
  Receipt,
  Users,
  Percent,
  Star,
  Menu,
  X,
} from "lucide-react";
import { logout } from "@/app/admin/login/actions";

type Badges = { reviews: number; orders: number };

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/categories", label: "Blog Categories", icon: Tags },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/products/categories", label: "Shop Categories", icon: Tags },
  { href: "/admin/services", label: "Services (Gigs)", icon: Briefcase },
  { href: "/admin/orders", label: "Orders", icon: Receipt, badgeKey: "orders" as const },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/discounts", label: "Discounts", icon: Percent },
  { href: "/admin/reviews", label: "Reviews", icon: Star, badgeKey: "reviews" as const },
  { href: "/admin/settings", label: "Theme & Settings", icon: Palette },
];

function NavBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="bg-primary ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function NavLinks({ badges, onNavigate }: { badges: Badges; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
            pathname === item.href
              ? "bg-soft text-primary"
              : "text-muted hover:bg-soft hover:text-primary"
          }`}
        >
          <item.icon size={16} />
          {item.label}
          {item.badgeKey && <NavBadge count={badges[item.badgeKey]} />}
        </Link>
      ))}
    </nav>
  );
}

export default function AdminNavShell({
  badges,
  children,
}: {
  badges: Badges;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const totalBadges = badges.reviews + badges.orders;

  return (
    <div className="mx-auto max-w-6xl px-5 py-6 md:flex md:gap-8 md:py-10">
      {/* Mobile top bar */}
      <div className="border-theme mb-4 flex items-center justify-between rounded-2xl border p-3 md:hidden">
        <span className="flex items-center gap-2 pl-1 text-sm font-bold">
          Admin menu
          {totalBadges > 0 && (
            <span className="bg-primary flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold text-white">
              {totalBadges > 99 ? "99+" : totalBadges}
            </span>
          )}
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="rounded-lg p-2"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="border-theme mb-6 rounded-2xl border p-4 md:hidden">
          <NavLinks badges={badges} onNavigate={() => setOpen(false)} />
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
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="border-theme sticky top-24 hidden h-fit max-h-[80vh] w-56 shrink-0 overflow-y-auto rounded-2xl border p-4 md:block">
        <NavLinks badges={badges} />
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

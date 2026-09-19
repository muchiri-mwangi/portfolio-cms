"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { logout } from "@/app/admin/login/actions";

type Badges = { reviews: number; orders: number };
type AdminIdentity = { email: string; avatarUrl: string | null; siteName: string };

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
    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function AdminAvatar({ admin, size = 32 }: { admin: AdminIdentity; size?: number }) {
  if (admin.avatarUrl) {
    return (
      <Image
        src={admin.avatarUrl}
        alt={admin.email}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-indigo-500 font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {(admin.email || "A").charAt(0).toUpperCase()}
    </div>
  );
}

function NavLinks({ badges, onNavigate }: { badges: Badges; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-0.5">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            pathname === item.href
              ? "bg-slate-800 text-white"
              : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
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
  admin,
  children,
}: {
  badges: Badges;
  admin: AdminIdentity;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const totalBadges = badges.reviews + badges.orders;

  return (
    <div className="min-h-screen">
      {/* Top bar — deliberately distinct from the public site's nav */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 text-white md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="rounded-lg p-1.5 hover:bg-slate-800 md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <ShieldCheck size={18} className="text-indigo-400" />
          <span className="font-bold tracking-tight">{admin.siteName} Admin</span>
          {totalBadges > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold">
              {totalBadges > 99 ? "99+" : totalBadges}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden items-center gap-1.5 text-sm text-slate-300 hover:text-white sm:flex"
          >
            <ExternalLink size={15} /> View site
          </Link>
          <div className="flex items-center gap-2">
            <AdminAvatar admin={admin} size={30} />
            <span className="hidden text-sm text-slate-300 sm:block">{admin.email}</span>
          </div>
          <form action={logout}>
            <button
              type="submit"
              aria-label="Sign out"
              className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <LogOut size={17} />
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-6 md:flex md:gap-8 md:py-8">
        {/* Mobile dropdown menu */}
        {open && (
          <div className="mb-6 rounded-2xl bg-slate-900 p-4 md:hidden">
            <NavLinks badges={badges} onNavigate={() => setOpen(false)} />
          </div>
        )}

        {/* Desktop sidebar */}
        <aside className="sticky top-20 hidden h-fit max-h-[calc(100vh-6rem)] w-56 shrink-0 overflow-y-auto rounded-2xl bg-slate-900 p-4 md:block">
          <NavLinks badges={badges} />
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

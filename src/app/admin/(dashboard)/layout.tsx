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
import { logout } from "../login/actions";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/categories", label: "Blog Categories", icon: Tags },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/products/categories", label: "Shop Categories", icon: Tags },
  { href: "/admin/services", label: "Services (Gigs)", icon: Briefcase },
  { href: "/admin/orders", label: "Orders", icon: Receipt },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/discounts", label: "Discounts", icon: Percent },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/settings", label: "Theme & Settings", icon: Palette },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
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
        </Link>
      ))}
    </nav>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-5 py-6 md:flex md:gap-8 md:py-10">
      {/* Mobile top bar */}
      <div className="border-theme mb-4 flex items-center justify-between rounded-2xl border p-3 md:hidden">
        <span className="pl-1 text-sm font-bold">Admin menu</span>
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
          <NavLinks onNavigate={() => setOpen(false)} />
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
        <NavLinks />
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

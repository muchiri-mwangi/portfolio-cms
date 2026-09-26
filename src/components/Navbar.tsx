"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/marketplace", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Lock background scroll while the overlay menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-theme bg-[var(--color-bg)]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight" onClick={() => setOpen(false)}>
          {settings.site_name}
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-7 text-sm font-medium md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`transition-colors hover:text-primary ${
                  pathname === l.href ? "text-primary" : ""
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/account"
            className="text-muted hover:text-primary flex items-center gap-1.5 text-sm font-medium"
          >
            <User size={16} /> My Account
          </Link>
          <Link
            href="/contact"
            className="bg-primary rounded-full px-4 py-2 text-sm font-semibold text-white"
          >
            Hire me
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="-mr-2 rounded-lg p-2 md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu: centered overlay, blurs the page behind it */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="relative flex h-full items-center justify-center px-6">
            <div className="bg-[var(--color-bg)] border-theme w-full max-w-sm rounded-2xl border p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-lg font-extrabold tracking-tight">{settings.site_name}</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="hover:bg-soft rounded-lg p-1.5"
                >
                  <X size={20} />
                </button>
              </div>

              <ul className="mt-5 flex flex-col gap-1">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-lg px-3 py-2.5 text-center text-base font-medium ${
                        pathname === l.href ? "bg-soft text-primary" : "hover:bg-soft"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="border-theme mt-4 flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium"
              >
                <User size={16} /> My Account
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="bg-primary mt-3 block rounded-full px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Hire me
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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
        <Link
          href="/contact"
          className="bg-primary hidden rounded-full px-4 py-2 text-sm font-semibold text-white md:inline-block"
        >
          Hire me
        </Link>

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

      {/* Mobile dropdown menu */}
      {open && (
        <div className="border-t border-theme px-5 pb-5 pt-2 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-base font-medium ${
                    pathname === l.href ? "bg-soft text-primary" : "hover:bg-soft"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="bg-primary mt-3 block rounded-full px-4 py-2.5 text-center text-sm font-semibold text-white"
          >
            Hire me
          </Link>
        </div>
      )}
    </header>
  );
}

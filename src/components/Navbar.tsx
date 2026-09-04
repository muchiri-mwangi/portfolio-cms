import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ settings }: { settings: SiteSettings }) {
  return (
    <header className="sticky top-0 z-40 border-b border-theme bg-[var(--color-bg)]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight">
          {settings.site_name}
        </Link>
        <ul className="hidden items-center gap-7 text-sm font-medium md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-primary transition-colors">
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
      </nav>
      {/* mobile nav */}
      <ul className="flex items-center justify-center gap-4 overflow-x-auto border-t border-theme px-4 py-2 text-xs font-medium md:hidden">
        {links.map((l) => (
          <li key={l.href} className="whitespace-nowrap">
            <Link href={l.href}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </header>
  );
}

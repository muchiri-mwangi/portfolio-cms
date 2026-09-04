import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-soft mt-24 border-t border-theme">
      <div className="mx-auto max-w-6xl px-5 py-10 text-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-bold">{settings.site_name}</p>
            <p className="text-muted mt-1 max-w-sm">{settings.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-5 text-muted">
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="hover:text-primary">
                {settings.email}
              </a>
            )}
            {settings.github_url && (
              <a href={settings.github_url} target="_blank" rel="noreferrer" className="hover:text-primary">
                GitHub
              </a>
            )}
            {settings.linkedin_url && (
              <a href={settings.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-primary">
                LinkedIn
              </a>
            )}
            <Link href="/admin/login" className="hover:text-primary">
              Admin
            </Link>
          </div>
        </div>
        <p className="text-muted mt-8 text-xs">
          © {new Date().getFullYear()} {settings.site_name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

import Link from "next/link";
import Image from "next/image";
import type { SiteSettings } from "@/lib/types";

export default function AuthorBox({ settings }: { settings: SiteSettings }) {
  const bioSnippet =
    settings.bio.length > 180 ? settings.bio.slice(0, 180).trim() + "…" : settings.bio;

  return (
    <div className="border-theme bg-soft mt-12 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
        {settings.avatar_url ? (
          <Image
            src={settings.avatar_url}
            alt={settings.site_name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="bg-accent flex h-full w-full items-center justify-center text-xl font-black text-white">
            {settings.site_name.charAt(0)}
          </div>
        )}
      </div>
      <div>
        <p className="text-muted text-xs font-bold uppercase tracking-wide">Written by</p>
        <p className="mt-0.5 font-bold">{settings.site_name}</p>
        <p className="text-primary text-xs font-semibold">{settings.tagline}</p>
        {bioSnippet && <p className="text-muted mt-2 text-sm">{bioSnippet}</p>}
        <Link href="/about" className="text-primary mt-2 inline-block text-sm font-semibold">
          More about me →
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/types";

const presets = [
  { name: "Crimson", primary: "#E63946", accent: "#1D3557" },
  { name: "Emerald", primary: "#2A9D8F", accent: "#264653" },
  { name: "Amber", primary: "#F4A261", accent: "#2A2A2A" },
  { name: "Violet", primary: "#7C3AED", accent: "#1E1B4B" },
  { name: "Ocean", primary: "#0077B6", accent: "#03045E" },
];

export default function SettingsForm({
  settings,
  action,
}: {
  settings: SiteSettings;
  action: (formData: FormData) => void;
}) {
  const [primary, setPrimary] = useState(settings.primary_color);
  const [accent, setAccent] = useState(settings.accent_color);
  const [avatarUrl, setAvatarUrl] = useState(settings.avatar_url ?? "");
  const [uploading, setUploading] = useState(false);

  async function handleAvatarUpload(file: File) {
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `avatar/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error } = await supabase.storage.from("media").upload(path, file);
      if (error) {
        alert(`Upload failed: ${error.message}`);
        return;
      }
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="avatar_url" value={avatarUrl} />
      <input type="hidden" name="primary_color" value={primary} />
      <input type="hidden" name="accent_color" value={accent} />

      <section>
        <h2 className="font-bold">Theme</h2>
        <p className="text-muted mt-1 text-sm">
          Pick a preset or set your own colors. Changes apply across the whole site.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              type="button"
              key={p.name}
              onClick={() => {
                setPrimary(p.primary);
                setAccent(p.accent);
              }}
              className="border-theme flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold"
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: p.primary }}
              />
              {p.name}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold">Primary color</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="color"
                value={primary}
                onChange={(e) => setPrimary(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded"
              />
              <input
                value={primary}
                onChange={(e) => setPrimary(e.target.value)}
                className="border-theme w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">Accent color</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded"
              />
              <input
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="border-theme w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="dark_mode" defaultChecked={settings.dark_mode} />
          Dark mode
        </label>
      </section>

      <section className="border-theme border-t pt-6">
        <h2 className="font-bold">Profile</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-semibold">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAvatarUpload(file);
              }}
              className="mt-1 w-full text-sm"
            />
            {uploading && <p className="text-muted mt-1 text-xs">Uploading…</p>}
            {avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="Avatar preview" className="mt-2 h-20 w-20 rounded-xl object-cover" />
            )}
          </div>
          <div>
            <label className="text-sm font-semibold">Site name / your name</label>
            <input
              name="site_name"
              defaultValue={settings.site_name}
              className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Blog brand name</label>
            <input
              name="blog_name"
              defaultValue={settings.blog_name}
              className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <p className="text-muted mt-1 text-xs">Shown as the blog&apos;s brand, e.g. on /blog.</p>
          </div>
          <div>
            <label className="text-sm font-semibold">Tagline</label>
            <input
              name="tagline"
              defaultValue={settings.tagline}
              className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Bio</label>
            <textarea
              name="bio"
              rows={4}
              defaultValue={settings.bio}
              className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>
      </section>

      <section className="border-theme border-t pt-6">
        <h2 className="font-bold">Contact & links</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              name="email"
              type="email"
              defaultValue={settings.email ?? ""}
              className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Phone</label>
            <input
              name="phone"
              defaultValue={settings.phone ?? ""}
              className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Location</label>
            <input
              name="location"
              defaultValue={settings.location ?? ""}
              className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">LinkedIn URL</label>
            <input
              name="linkedin_url"
              defaultValue={settings.linkedin_url ?? ""}
              className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">GitHub URL</label>
            <input
              name="github_url"
              defaultValue={settings.github_url ?? ""}
              className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>
      </section>

      <button
        type="submit"
        className="bg-primary rounded-full px-6 py-2.5 text-sm font-bold text-white"
      >
        Save changes
      </button>
    </form>
  );
}

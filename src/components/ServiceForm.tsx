"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Service } from "@/lib/types";

export default function ServiceForm({
  service,
  action,
}: {
  service?: Service;
  action: (formData: FormData) => void;
}) {
  const [coverUrl, setCoverUrl] = useState(service?.cover_image_url ?? "");
  const [uploading, setUploading] = useState(false);

  async function handleCoverUpload(file: File) {
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `services/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error } = await supabase.storage.from("media").upload(path, file);
      if (error) {
        alert(`Upload failed: ${error.message}`);
        return;
      }
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setCoverUrl(data.publicUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="cover_image_url" value={coverUrl} />

      <div>
        <label className="text-sm font-semibold" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={service?.title}
          placeholder="e.g. Home network setup & optimization"
          className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="text-sm font-semibold" htmlFor="description">
          Description — what's included, what you need from the client
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={service?.description}
          className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 outline-none focus:border-primary"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold" htmlFor="price_kes">
            Price (KES)
          </label>
          <input
            id="price_kes"
            name="price_kes"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={service?.price_kes ?? 0}
            className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-sm font-semibold" htmlFor="delivery_days">
            Delivery time (days)
          </label>
          <input
            id="delivery_days"
            name="delivery_days"
            type="number"
            min="1"
            required
            defaultValue={service?.delivery_days ?? 3}
            className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold">Cover image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleCoverUpload(file);
          }}
          className="mt-1 w-full text-sm"
        />
        {uploading && <p className="text-muted mt-1 text-xs">Uploading…</p>}
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt="Cover preview" className="mt-2 h-24 rounded-lg object-cover" />
        )}
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="published" defaultChecked={service?.published ?? false} />
        Published (visible on the services page)
      </label>

      <button
        type="submit"
        className="bg-primary rounded-full px-6 py-2.5 text-sm font-bold text-white"
      >
        Save service
      </button>
    </form>
  );
}

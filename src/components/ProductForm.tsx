"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";

export default function ProductForm({
  product,
  action,
}: {
  product?: Product;
  action: (formData: FormData) => void;
}) {
  const [coverUrl, setCoverUrl] = useState(product?.cover_image_url ?? "");
  const [filePath, setFilePath] = useState(product?.file_path ?? "");
  const [fileName, setFileName] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  async function handleCoverUpload(file: File) {
    setUploadingCover(true);
    try {
      const supabase = createClient();
      const path = `products/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error } = await supabase.storage.from("media").upload(path, file);
      if (error) {
        alert(`Upload failed: ${error.message}`);
        return;
      }
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setCoverUrl(data.publicUrl);
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleFileUpload(file: File) {
    setUploadingFile(true);
    try {
      const supabase = createClient();
      const path = `files/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error } = await supabase.storage.from("digital-products").upload(path, file);
      if (error) {
        alert(`Upload failed: ${error.message}`);
        return;
      }
      setFilePath(path);
      setFileName(file.name);
    } finally {
      setUploadingFile(false);
    }
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="cover_image_url" value={coverUrl} />
      <input type="hidden" name="file_path" value={filePath} />

      <div>
        <label className="text-sm font-semibold" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={product?.title}
          className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="text-sm font-semibold" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description}
          className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 outline-none focus:border-primary"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold" htmlFor="type">
            Type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={product?.type ?? "template"}
            className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 outline-none focus:border-primary"
          >
            <option value="template">Template</option>
            <option value="ebook">Ebook</option>
          </select>
        </div>
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
            defaultValue={product?.price_kes ?? 0}
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
        {uploadingCover && <p className="text-muted mt-1 text-xs">Uploading…</p>}
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt="Cover preview" className="mt-2 h-24 rounded-lg object-cover" />
        )}
      </div>

      <div>
        <label className="text-sm font-semibold">Deliverable file (private — only buyers get this)</label>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          className="mt-1 w-full text-sm"
        />
        {uploadingFile && <p className="text-muted mt-1 text-xs">Uploading…</p>}
        {filePath && (
          <p className="text-muted mt-1 text-xs">
            {fileName || filePath} {product?.file_path && !fileName ? "(current file kept)" : "uploaded"}
          </p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="published" defaultChecked={product?.published ?? false} />
        Published (visible in the marketplace)
      </label>

      <button
        type="submit"
        className="bg-primary rounded-full px-6 py-2.5 text-sm font-bold text-white"
      >
        Save product
      </button>
    </form>
  );
}

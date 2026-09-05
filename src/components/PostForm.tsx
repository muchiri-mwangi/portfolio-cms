"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/client";
import type { Category, Post } from "@/lib/types";

export default function PostForm({
  post,
  categories,
  action,
}: {
  post?: Post;
  categories: Category[];
  action: (formData: FormData) => void;
}) {
  const [coverUrl, setCoverUrl] = useState(post?.cover_image_url ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `covers/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
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
          defaultValue={post?.title}
          className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="text-sm font-semibold" htmlFor="excerpt">
          Excerpt (short summary shown on cards)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt ?? ""}
          className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 outline-none focus:border-primary"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold" htmlFor="category_id">
            Category
          </label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={post?.category_id ?? ""}
            className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 outline-none focus:border-primary"
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold">Cover image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
            className="mt-1 w-full text-sm"
          />
          {uploading && <p className="text-muted mt-1 text-xs">Uploading…</p>}
          {coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt="Cover preview" className="mt-2 h-24 rounded-lg object-cover" />
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold" htmlFor="content">
            Content (Markdown supported)
          </label>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="text-primary text-xs font-semibold"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>
        <p className="text-muted mb-1 text-xs">
          Drop in a product grid anywhere with <code>[[products:category-slug]]</code>{" "}
          (optionally <code>[[products:category-slug:6]]</code> for a custom count).
        </p>
        {showPreview ? (
          <div className="prose-content border-theme mt-1 min-h-[300px] rounded-lg border px-4 py-3">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            id="content"
            name="content"
            required
            rows={16}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 font-mono text-sm outline-none focus:border-primary"
          />
        )}
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="published" defaultChecked={post?.published ?? false} />
        Published (visible on the public blog)
      </label>

      <button
        type="submit"
        className="bg-primary rounded-full px-6 py-2.5 text-sm font-bold text-white"
      >
        Save post
      </button>
    </form>
  );
}

"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  ImagePlus,
  Eye,
  Pencil,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { convertToWebP } from "@/lib/image-utils";
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
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingContentImage, setUploadingContentImage] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);

  async function handleCoverUpload(file: File) {
    setUploadingCover(true);
    try {
      const converted = await convertToWebP(file);
      const supabase = createClient();
      const path = `covers/${Date.now()}-${converted.name.replace(/\s+/g, "-")}`;
      const { error } = await supabase.storage.from("media").upload(path, converted);
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

  // Inserts text at the current cursor position (or appends, if the
  // textarea isn't focused) and puts the cursor right after it.
  function insertAtCursor(text: string) {
    const el = textareaRef.current;
    if (!el) {
      setContent((c) => c + text);
      return;
    }
    const start = el.selectionStart ?? content.length;
    const end = el.selectionEnd ?? content.length;
    const next = content.slice(0, start) + text + content.slice(end);
    setContent(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + text.length;
      el.setSelectionRange(pos, pos);
    });
  }

  // Wraps the current selection (or a placeholder) in markdown syntax —
  // used for bold/italic/link.
  function wrapSelection(before: string, after: string = before, placeholder = "text") {
    const el = textareaRef.current;
    const start = el?.selectionStart ?? content.length;
    const end = el?.selectionEnd ?? content.length;
    const selected = content.slice(start, end) || placeholder;
    const next = content.slice(0, start) + before + selected + after + content.slice(end);
    setContent(next);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  // Prefixes every line touched by the current selection — used for
  // headings, lists, and quotes.
  function prefixLines(prefix: string) {
    const el = textareaRef.current;
    const start = el?.selectionStart ?? 0;
    const end = el?.selectionEnd ?? start;
    const lineStart = content.lastIndexOf("\n", start - 1) + 1;
    let lineEnd = content.indexOf("\n", end);
    if (lineEnd === -1) lineEnd = content.length;
    const block = content.slice(lineStart, lineEnd);
    const prefixed = block
      .split("\n")
      .map((line) => (line.startsWith(prefix) ? line : prefix + line))
      .join("\n");
    const next = content.slice(0, lineStart) + prefixed + content.slice(lineEnd);
    setContent(next);
    requestAnimationFrame(() => el?.focus());
  }

  function handleLink() {
    const url = window.prompt("Link URL:", "https://");
    if (!url) return;
    wrapSelection("[", `](${url})`, "link text");
  }

  async function handleContentImageUpload(file: File) {
    setUploadingContentImage(true);
    try {
      const converted = await convertToWebP(file);
      const supabase = createClient();
      const path = `posts/${Date.now()}-${converted.name.replace(/\s+/g, "-")}`;
      const { error } = await supabase.storage.from("media").upload(path, converted);
      if (error) {
        alert(`Upload failed: ${error.message}`);
        return;
      }
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      insertAtCursor(`\n![](${data.publicUrl})\n`);
    } finally {
      setUploadingContentImage(false);
      if (contentImageInputRef.current) contentImageInputRef.current.value = "";
    }
  }

  const toolbarButtons = [
    { icon: Bold, label: "Bold", onClick: () => wrapSelection("**") },
    { icon: Italic, label: "Italic", onClick: () => wrapSelection("*") },
    { icon: Heading2, label: "Heading", onClick: () => prefixLines("## ") },
    { icon: Heading3, label: "Subheading", onClick: () => prefixLines("### ") },
    { icon: Quote, label: "Quote", onClick: () => prefixLines("> ") },
    { icon: List, label: "Bulleted list", onClick: () => prefixLines("- ") },
    { icon: ListOrdered, label: "Numbered list", onClick: () => prefixLines("1. ") },
    { icon: Link2, label: "Link", onClick: handleLink },
  ];

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
              if (file) handleCoverUpload(file);
            }}
            className="mt-1 w-full text-sm"
          />
          {uploadingCover && <p className="text-muted mt-1 text-xs">Converting & uploading…</p>}
          {coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt="Cover preview" className="mt-2 h-24 rounded-lg object-cover" />
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold" htmlFor="content">
            Content
          </label>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="text-primary flex items-center gap-1 text-xs font-semibold"
          >
            {showPreview ? <Pencil size={13} /> : <Eye size={13} />}
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>
        <p className="text-muted mb-2 text-xs">
          Drop in a product grid anywhere with <code>[[products:category-slug]]</code>{" "}
          (optionally <code>[[products:category-slug:6]]</code> for a custom count).
        </p>

        {!showPreview && (
          <div className="border-theme flex flex-wrap items-center gap-1 rounded-t-lg border border-b-0 bg-[var(--color-bg-soft)] p-1.5">
            {toolbarButtons.map((btn) => (
              <button
                key={btn.label}
                type="button"
                title={btn.label}
                onClick={btn.onClick}
                className="hover:bg-soft rounded-md p-1.5 text-slate-600"
              >
                <btn.icon size={16} />
              </button>
            ))}
            <span className="bg-theme mx-1 h-5 w-px bg-slate-300" />
            <button
              type="button"
              title="Insert image"
              disabled={uploadingContentImage}
              onClick={() => contentImageInputRef.current?.click()}
              className="hover:bg-soft flex items-center gap-1 rounded-md p-1.5 text-slate-600 disabled:opacity-50"
            >
              <ImagePlus size={16} />
              {uploadingContentImage && <span className="text-xs">Uploading…</span>}
            </button>
            <input
              ref={contentImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleContentImageUpload(file);
              }}
            />
          </div>
        )}

        {showPreview ? (
          <div className="prose-content border-theme min-h-[300px] rounded-lg rounded-t-none border px-4 py-3">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            id="content"
            name="content"
            required
            rows={16}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border-theme w-full rounded-b-lg border px-4 py-2.5 font-mono text-sm outline-none focus:border-primary"
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

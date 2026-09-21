"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy } from "lucide-react";
import ConfirmDeleteButton from "@/components/ConfirmDeleteButton";
import { deleteMediaFile } from "@/app/admin/(dashboard)/media/actions";

export default function MediaLibraryItem({
  url,
  path,
  sizeLabel,
  dateLabel,
}: {
  url: string;
  path: string;
  sizeLabel: string;
  dateLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copy this URL:", url);
    }
  }

  return (
    <div className="border-theme overflow-hidden rounded-xl border">
      <div className="bg-soft relative aspect-square">
        <Image src={url} alt={path} fill sizes="200px" className="object-cover" />
      </div>
      <div className="p-2.5">
        <p className="truncate text-xs font-medium" title={path}>
          {path.split("/").pop()}
        </p>
        <p className="text-muted mt-0.5 text-[11px]">
          {sizeLabel} · {dateLabel}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopy}
            className="text-muted hover:text-primary flex items-center gap-1 text-[11px] font-semibold"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy URL"}
          </button>
          <ConfirmDeleteButton
            action={deleteMediaFile.bind(null, path)}
            confirmText="Delete this file? If it's still used somewhere on your site, that image will break."
            className="text-[11px] font-semibold text-red-600"
          />
        </div>
      </div>
    </div>
  );
}

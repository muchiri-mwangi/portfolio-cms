"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DeliveryUploadForm({
  action,
}: {
  action: (formData: FormData) => void;
}) {
  const [filePath, setFilePath] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `deliveries/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error } = await supabase.storage.from("digital-products").upload(path, file);
      if (error) {
        alert(`Upload failed: ${error.message}`);
        return;
      }
      setFilePath(path);
      setFileName(file.name);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="mt-3 space-y-2 border-t border-theme pt-3">
      <input type="hidden" name="delivery_file_path" value={filePath} />
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        className="w-full text-xs"
      />
      {uploading && <p className="text-muted text-xs">Uploading…</p>}
      {fileName && <p className="text-muted text-xs">{fileName} uploaded</p>}
      <textarea
        name="delivery_note"
        rows={2}
        placeholder="Note to the client (optional)"
        className="border-theme w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-primary"
      />
      <button type="submit" className="bg-primary rounded-lg px-4 py-1.5 text-xs font-bold text-white">
        Mark delivered
      </button>
    </form>
  );
}

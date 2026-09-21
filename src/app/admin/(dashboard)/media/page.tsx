import { createClient } from "@/lib/supabase/server";
import MediaLibraryItem from "@/components/MediaLibraryItem";

export const metadata = { title: "Media Library" };

const FOLDERS = ["covers", "posts", "products", "services", "avatar"] as const;

function formatBytes(bytes: number) {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default async function MediaLibraryPage() {
  const supabase = await createClient();

  const results = await Promise.all(
    FOLDERS.map((folder) =>
      supabase.storage
        .from("media")
        .list(folder, { limit: 100, sortBy: { column: "created_at", order: "desc" } })
    )
  );

  const files = FOLDERS.flatMap((folder, i) => {
    const { data } = results[i];
    return (data ?? [])
      .filter((f) => f.id) // real files only, not folder placeholders
      .map((f) => {
        const path = `${folder}/${f.name}`;
        const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
        return {
          path,
          url: urlData.publicUrl,
          size: f.metadata?.size ?? 0,
          createdAt: f.created_at ?? "",
        };
      });
  }).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div>
      <h1 className="text-2xl font-black">Media Library</h1>
      <p className="text-muted mt-1 text-sm">
        Every image uploaded across posts, products, services, and your profile —{" "}
        {files.length} file{files.length === 1 ? "" : "s"}, {formatBytes(totalSize)} total.
      </p>
      <p className="text-muted mt-1 text-xs">
        Deleting a file here removes it from storage — if it's still attached to a post,
        product, or service, that image will break there too.
      </p>

      {files.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {files.map((f) => (
            <MediaLibraryItem
              key={f.path}
              url={f.url}
              path={f.path}
              sizeLabel={formatBytes(f.size)}
              dateLabel={f.createdAt ? new Date(f.createdAt).toLocaleDateString() : ""}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted mt-16 text-center text-sm">
          No uploads yet — images you add to posts, products, services, or your profile will
          show up here.
        </p>
      )}
    </div>
  );
}

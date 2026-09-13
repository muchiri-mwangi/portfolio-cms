import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  totalPages,
  basePath,
  searchParams = {},
  pageParam = "page",
}: {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
  pageParam?: string;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(p: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value);
    }
    if (p > 1) params.set(pageParam, String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-4">
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          className="border-theme flex items-center gap-1 rounded-full border px-4 py-2 text-sm font-semibold"
        >
          <ChevronLeft size={16} /> Previous
        </Link>
      ) : (
        <span className="text-muted flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold opacity-40">
          <ChevronLeft size={16} /> Previous
        </span>
      )}

      <span className="text-muted text-sm">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link
          href={hrefFor(page + 1)}
          className="border-theme flex items-center gap-1 rounded-full border px-4 py-2 text-sm font-semibold"
        >
          Next <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="text-muted flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold opacity-40">
          Next <ChevronRight size={16} />
        </span>
      )}
    </div>
  );
}

"use client";

import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="border-theme hover:border-primary hover:text-primary flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"
    >
      <ArrowUp size={13} /> Back to top
    </button>
  );
}

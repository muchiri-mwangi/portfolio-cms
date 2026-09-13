"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/toc";

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    // A heading counts as "current" once it crosses into the top ~30% of
    // the viewport and hasn't scrolled past the bottom yet — this is what
    // makes the highlighted item track actual reading progress instead of
    // just whichever heading is nearest the top of the page.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="text-muted mb-3 text-xs font-bold uppercase tracking-wide">On this page</p>
      <ul className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "ml-3" : ""}>
            <a
              href={`#${h.id}`}
              className={`block border-l-2 py-0.5 pl-3 text-sm transition-colors ${
                activeId === h.id
                  ? "border-primary text-primary font-semibold"
                  : "border-theme text-muted hover:text-primary"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

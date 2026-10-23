"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

// Renders nothing at all until ads are switched on in admin settings with a
// valid AdSense publisher ID — so placing <AdSlot /> in templates now costs
// nothing visually, and turning ads on later is just a settings toggle.
export default function AdSlot({
  publisherId,
  enabled,
  className,
}: {
  publisherId: string | null;
  enabled: boolean;
  className?: string;
}) {
  const active = enabled && Boolean(publisherId);

  useEffect(() => {
    if (!active) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script may be blocked (ad blockers) — fail silently.
    }
  }, [active]);

  if (!active) return null;

  return (
    <div className={className} aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={publisherId ?? undefined}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

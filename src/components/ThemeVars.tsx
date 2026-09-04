import type { SiteSettings } from "@/lib/types";

export default function ThemeVars({ settings }: { settings: SiteSettings }) {
  return (
    <style
      // Server-rendered inline style tag so the chosen theme applies
      // on first paint, no flash of default colors.
      dangerouslySetInnerHTML={{
        __html: `:root { --color-primary: ${settings.primary_color}; --color-accent: ${settings.accent_color}; }`,
      }}
    />
  );
}

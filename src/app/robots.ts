import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/data";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const settings = await getSiteSettings();

  const extra = (settings.robots_disallow_extra ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/account/", ...extra],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";
import { getPublishedPosts, getPublishedProducts, getPublishedServices } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/projects",
    "/marketplace",
    "/blog",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const [posts, products, services] = await Promise.all([
    getPublishedPosts(),
    getPublishedProducts(),
    getPublishedServices(),
  ]);

  const postRoutes = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
  }));

  const productRoutes = products.map((p) => ({
    url: `${siteUrl}/marketplace/${p.slug}`,
    lastModified: new Date(p.created_at),
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${siteUrl}/services/${s.slug}`,
    lastModified: new Date(s.created_at),
  }));

  return [...staticRoutes, ...postRoutes, ...productRoutes, ...serviceRoutes];
}

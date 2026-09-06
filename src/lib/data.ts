import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type {
  Category,
  Post,
  Product,
  ProductCategory,
  Review,
  Service,
  SiteSettings,
} from "@/lib/types";

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  site_name: "Your Name",
  blog_name: "Muchiri",
  tagline: "Technician & AI Data Annotation Specialist",
  bio: "Update your bio from the admin settings page.",
  primary_color: "#E63946",
  accent_color: "#1D3557",
  dark_mode: false,
  avatar_url: null,
  email: null,
  phone: null,
  location: null,
  linkedin_url: null,
  github_url: null,
};

function supabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Every function below is wrapped in React's cache() so that calling it
// more than once during the same render (e.g. the root layout AND a page
// both need the site settings) hits the database once, not once per call.
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!supabaseConfigured()) return DEFAULT_SETTINGS;
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();
    return data ? { ...DEFAULT_SETTINGS, ...data } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
});

export const getCategories = cache(async (): Promise<Category[]> => {
  if (!supabaseConfigured()) return [];
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
});

export const getPublishedPosts = cache(async (categorySlug?: string): Promise<Post[]> => {
  if (!supabaseConfigured()) return [];
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from("posts")
      .select("*, category:categories(*)")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (categorySlug) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();
      if (cat) query = query.eq("category_id", cat.id);
    }

    const { data } = await query;
    return data ?? [];
  } catch {
    return [];
  }
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  if (!supabaseConfigured()) return null;
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("posts")
      .select("*, category:categories(*)")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
});

export const getProductCategories = cache(async (): Promise<ProductCategory[]> => {
  if (!supabaseConfigured()) return [];
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("product_categories")
      .select("*")
      .order("name", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
});

export const getPublishedProducts = cache(async (categorySlug?: string): Promise<Product[]> => {
  if (!supabaseConfigured()) return [];
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from("products")
      .select("*, category:product_categories(*)")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (categorySlug) {
      const { data: cat } = await supabase
        .from("product_categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();
      if (cat) query = query.eq("category_id", cat.id);
    }

    const { data } = await query;
    return data ?? [];
  } catch {
    return [];
  }
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  if (!supabaseConfigured()) return null;
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:product_categories(*)")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
});

// Products picked for an in-post embed grid — e.g. `[[products:ai-tools]]`.
export async function getProductsForEmbed(categorySlug: string, limit = 3): Promise<Product[]> {
  return (await getPublishedProducts(categorySlug)).slice(0, limit);
}

export const getApprovedReviews = cache(async (productId: string): Promise<Review[]> => {
  if (!supabaseConfigured()) return [];
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("approved", true)
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
});

export const getPublishedServices = cache(async (): Promise<Service[]> => {
  if (!supabaseConfigured()) return [];
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
});

export const getServiceBySlug = cache(async (slug: string): Promise<Service | null> => {
  if (!supabaseConfigured()) return null;
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
});

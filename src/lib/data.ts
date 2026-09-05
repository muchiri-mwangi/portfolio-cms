import { createClient } from "@/lib/supabase/server";
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

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!supabaseConfigured()) return DEFAULT_SETTINGS;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();
    return data ? { ...DEFAULT_SETTINGS, ...data } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!supabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPublishedPosts(categorySlug?: string): Promise<Post[]> {
  if (!supabaseConfigured()) return [];
  try {
    const supabase = await createClient();
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
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!supabaseConfigured()) return null;
  try {
    const supabase = await createClient();
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
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  if (!supabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("product_categories")
      .select("*")
      .order("name", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPublishedProducts(categorySlug?: string): Promise<Product[]> {
  if (!supabaseConfigured()) return [];
  try {
    const supabase = await createClient();
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
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!supabaseConfigured()) return null;
  try {
    const supabase = await createClient();
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
}

// Products picked for an in-post embed grid — e.g. `[[products:ai-tools]]` —
// so a draft post can showcase products without needing them published-wide
// gating logic beyond the normal published flag.
export async function getProductsForEmbed(categorySlug: string, limit = 3): Promise<Product[]> {
  return (await getPublishedProducts(categorySlug)).slice(0, limit);
}

export async function getApprovedReviews(productId: string): Promise<Review[]> {
  if (!supabaseConfigured()) return [];
  try {
    const supabase = await createClient();
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
}

export async function getPublishedServices(): Promise<Service[]> {
  if (!supabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  if (!supabaseConfigured()) return null;
  try {
    const supabase = await createClient();
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
}

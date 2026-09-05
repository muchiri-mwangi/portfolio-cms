export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category_id: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  category?: Category | null;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: "template" | "ebook";
  price_kes: number;
  compare_at_price_kes: number | null;
  category_id: string | null;
  cover_image_url: string | null;
  file_path: string | null;
  published: boolean;
  created_at: string;
  category?: ProductCategory | null;
};

export type Order = {
  id: string;
  product_id: string | null;
  buyer_name: string | null;
  buyer_email: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed";
  intasend_checkout_id: string | null;
  created_at: string;
  paid_at: string | null;
};

export type Coupon = {
  id: string;
  code: string;
  percent_off: number | null;
  amount_off_kes: number | null;
  active: boolean;
  expires_at: string | null;
  max_redemptions: number | null;
  times_redeemed: number;
  created_at: string;
};

export type Review = {
  id: string;
  product_id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  created_at: string;
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price_kes: number;
  delivery_days: number;
  cover_image_url: string | null;
  published: boolean;
  created_at: string;
};

export type ServiceOrder = {
  id: string;
  service_id: string | null;
  buyer_name: string | null;
  buyer_email: string;
  requirements: string | null;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "in_progress" | "delivered" | "completed" | "failed";
  intasend_checkout_id: string | null;
  delivery_note: string | null;
  delivery_file_path: string | null;
  created_at: string;
  paid_at: string | null;
  delivered_at: string | null;
};

export type SiteSettings = {
  id: number;
  site_name: string;
  blog_name: string;
  tagline: string;
  bio: string;
  primary_color: string;
  accent_color: string;
  dark_mode: boolean;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  github_url: string | null;
};

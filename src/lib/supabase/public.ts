import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Used only for PUBLIC, read-only data (site settings, published posts,
// products, services, reviews). Unlike src/lib/supabase/server.ts, this
// never touches cookies() — that's what was silently forcing every public
// page into fully dynamic (uncached, live-database-on-every-request)
// rendering. Never use this for anything that depends on the signed-in
// admin session.
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

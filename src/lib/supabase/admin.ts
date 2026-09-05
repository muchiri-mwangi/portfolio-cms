import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-only client using the service-role key. Bypasses Row Level Security,
// so this must NEVER be imported into client components or exposed to the
// browser. Only used from Server Actions and Route Handlers (order creation,
// the IntaSend webhook, and generating signed download URLs).
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

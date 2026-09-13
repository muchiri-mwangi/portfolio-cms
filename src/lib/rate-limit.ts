import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Returns true if this identifier has already hit the limit for this form
 * type in the given window — the caller should stop and reject the
 * submission. Otherwise logs this attempt and returns false.
 */
export async function isRateLimited(
  formType: string,
  identifier: string,
  maxAttempts = 5,
  windowMinutes = 60
): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const since = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

    const { count } = await supabase
      .from("submission_log")
      .select("*", { count: "exact", head: true })
      .eq("form_type", formType)
      .eq("identifier", identifier)
      .gte("created_at", since);

    if ((count ?? 0) >= maxAttempts) return true;

    await supabase.from("submission_log").insert({ form_type: formType, identifier });
    return false;
  } catch {
    // If the rate-limit check itself fails, fail open — never block a
    // legitimate submission because of an infrastructure hiccup.
    return false;
  }
}

/** Best-effort caller IP, for forms (like reviews) that don't collect an email. */
export async function getClientIdentifier(fallback?: string | null) {
  if (fallback) return fallback;
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

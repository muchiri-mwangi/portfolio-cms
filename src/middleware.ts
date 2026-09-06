import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Only /admin needs the auth check + session refresh. Running this on
  // every public page (home, blog, marketplace...) meant an extra
  // Supabase auth round-trip before ANY page could render — a big part of
  // why the site felt slow. Public pages don't need it at all.
  matcher: ["/admin/:path*"],
};

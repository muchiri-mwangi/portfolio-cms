import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // /admin needs the role check above; /account needs a logged-in
  // customer. Public pages skip this entirely.
  matcher: ["/admin/:path*", "/account/:path*"],
};

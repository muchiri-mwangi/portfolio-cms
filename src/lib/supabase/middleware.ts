import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin");
  const isAdminLoginRoute = path.startsWith("/admin/login");
  const isAccountRoute = path.startsWith("/account");
  const isAccountAuthRoute = path.startsWith("/account/login") || path.startsWith("/account/callback");

  // Being logged in is not enough for /admin — being logged in AS THE ADMIN
  // is. A customer account (see 006_customer_accounts.sql) is a normal,
  // logged-in Supabase user, so this check has to look at the role, not
  // just whether a session exists.
  let isAdmin = false;
  if (user && (isAdminRoute || isAdminLoginRoute)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  if (isAdminRoute && !isAdminLoginRoute && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (isAdminLoginRoute && isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  if (isAccountRoute && !isAccountAuthRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/account/login";
    return NextResponse.redirect(url);
  }

  if (path.startsWith("/account/login") && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/account";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

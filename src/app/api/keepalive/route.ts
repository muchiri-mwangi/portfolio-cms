import { NextRequest, NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

// Called once a day by Vercel Cron (see vercel.json). Supabase's free tier
// pauses a project after about a week with no activity, which takes the
// whole site's data offline — a tiny daily read keeps it counted as active.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Vercel Cron automatically sends `Authorization: Bearer <CRON_SECRET>`
  // when the CRON_SECRET env var is set, so random visitors can't trigger this.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createPublicClient();
  const { error } = await supabase.from("site_settings").select("id").eq("id", 1).single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, checked_at: new Date().toISOString() });
}

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// IntaSend sends a "challenge" string in each webhook payload that must
// match the one you configure in your IntaSend dashboard (Settings ->
// Webhooks). Set INTASEND_WEBHOOK_CHALLENGE to that same value so we can
// verify the request actually came from IntaSend.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const expectedChallenge = process.env.INTASEND_WEBHOOK_CHALLENGE;
  if (expectedChallenge && body.challenge !== expectedChallenge) {
    return NextResponse.json({ error: "Invalid challenge" }, { status: 401 });
  }

  // IntaSend's checkout webhook includes api_ref (what we set to our order
  // id) and state/status fields indicating the payment outcome.
  const apiRef: string | undefined = body.api_ref || body.invoice?.api_ref;
  const state: string | undefined = body.state || body.invoice?.state || body.status;

  if (!apiRef) {
    return NextResponse.json({ error: "Missing api_ref" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const isPaid = ["COMPLETE", "COMPLETED", "PAID"].includes(String(state).toUpperCase());
  const isFailed = ["FAILED", "CANCELLED"].includes(String(state).toUpperCase());

  if (isPaid) {
    await supabase
      .from("orders")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", apiRef);
  } else if (isFailed) {
    await supabase.from("orders").update({ status: "failed" }).eq("id", apiRef);
  }

  return NextResponse.json({ received: true });
}

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// IntaSend sends a "challenge" string in each webhook payload that must
// match the one you configure in your IntaSend dashboard (Settings ->
// Webhooks). Set INTASEND_WEBHOOK_CHALLENGE to that same value so we can
// verify the request actually came from IntaSend.
//
// api_ref is prefixed by us at checkout time: "p_<order id>" for a
// marketplace product order, "s_<order id>" for a service (gig) order —
// that prefix is how this webhook knows which table to update.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const expectedChallenge = process.env.INTASEND_WEBHOOK_CHALLENGE;
  if (expectedChallenge && body.challenge !== expectedChallenge) {
    return NextResponse.json({ error: "Invalid challenge" }, { status: 401 });
  }

  const apiRef: string | undefined = body.api_ref || body.invoice?.api_ref;
  const state: string | undefined = body.state || body.invoice?.state || body.status;

  if (!apiRef) {
    return NextResponse.json({ error: "Missing api_ref" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const isPaid = ["COMPLETE", "COMPLETED", "PAID"].includes(String(state).toUpperCase());
  const isFailed = ["FAILED", "CANCELLED"].includes(String(state).toUpperCase());

  if (!isPaid && !isFailed) {
    return NextResponse.json({ received: true, ignored: true });
  }

  const [prefix, orderId] = apiRef.includes("_") ? apiRef.split(/_(.+)/) : [null, apiRef];
  const table = prefix === "s" ? "service_orders" : "orders";
  const id = orderId ?? apiRef;

  if (isPaid) {
    await supabase
      .from(table)
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", id);
  } else {
    await supabase.from(table).update({ status: "failed" }).eq("id", id);
  }

  return NextResponse.json({ received: true });
}

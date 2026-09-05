// Thin wrapper around IntaSend's Checkout API. Docs:
// https://developers.intasend.com/docs/checkout-links

const API_BASE = () =>
  process.env.INTASEND_TEST_MODE === "false"
    ? "https://payment.intasend.com"
    : "https://sandbox.intasend.com";

export async function createIntasendCheckout(params: {
  amount: number;
  currency: string;
  email: string;
  firstName?: string;
  lastName?: string;
  redirectUrl: string;
  apiRef: string;
}) {
  const publicKey = process.env.INTASEND_PUBLISHABLE_KEY;
  if (!publicKey) {
    throw new Error(
      "INTASEND_PUBLISHABLE_KEY is not set. Add your IntaSend keys to environment variables to enable checkout."
    );
  }

  const res = await fetch(`${API_BASE()}/api/v1/checkout/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      public_key: publicKey,
      amount: params.amount,
      currency: params.currency,
      email: params.email,
      first_name: params.firstName || "Customer",
      last_name: params.lastName || "",
      country: "KE",
      redirect_url: params.redirectUrl,
      api_ref: params.apiRef,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`IntaSend checkout failed: ${res.status} ${text}`);
  }

  return (await res.json()) as { id: string; url: string };
}

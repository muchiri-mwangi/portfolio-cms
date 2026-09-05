import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Your order" };

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ setup?: string }>;
}) {
  const { id } = await params;
  const { setup } = await searchParams;
  const supabase = createAdminClient();

  const { data: order } = await supabase.from("orders").select("*").eq("id", id).single();
  if (!order) notFound();

  let downloadUrl: string | null = null;

  if (order.status === "paid" && order.product_id) {
    const { data: product } = await supabase
      .from("products")
      .select("file_path, title")
      .eq("id", order.product_id)
      .single();

    if (product?.file_path) {
      const { data: signed } = await supabase.storage
        .from("digital-products")
        .createSignedUrl(product.file_path, 60 * 60); // 1 hour
      downloadUrl = signed?.signedUrl ?? null;
    }
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-20 text-center">
      {setup && (
        <p className="mb-6 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
          Checkout isn&apos;t fully configured yet — add your IntaSend API keys as
          environment variables to accept live payments.
        </p>
      )}

      {order.status === "paid" ? (
        <>
          <CheckCircle2 className="text-primary mx-auto" size={48} />
          <h1 className="mt-4 text-2xl font-black">Payment confirmed</h1>
          <p className="text-muted mt-2">Thanks for your purchase, {order.buyer_name || "friend"}.</p>
          {downloadUrl ? (
            <a
              href={downloadUrl}
              className="bg-primary mt-8 inline-block rounded-full px-8 py-3 text-sm font-bold text-white"
            >
              Download your file
            </a>
          ) : (
            <p className="text-muted mt-6 text-sm">
              Your file isn&apos;t attached yet — reach out via the contact page and
              mention order {order.id.slice(0, 8)}.
            </p>
          )}
        </>
      ) : order.status === "failed" ? (
        <>
          <AlertTriangle className="mx-auto text-red-500" size={48} />
          <h1 className="mt-4 text-2xl font-black">Payment failed</h1>
          <p className="text-muted mt-2">That payment didn&apos;t go through. You can try again.</p>
          <Link
            href="/marketplace"
            className="bg-primary mt-8 inline-block rounded-full px-8 py-3 text-sm font-bold text-white"
          >
            Back to marketplace
          </Link>
        </>
      ) : (
        <>
          <Clock className="text-primary mx-auto" size={48} />
          <h1 className="mt-4 text-2xl font-black">Waiting for payment</h1>
          <p className="text-muted mt-2">
            If you just completed payment, refresh this page in a moment.
          </p>
          <a
            href={`/marketplace/order/${order.id}`}
            className="border-theme mt-8 inline-block rounded-full border px-8 py-3 text-sm font-bold"
          >
            Refresh
          </a>
        </>
      )}
    </div>
  );
}

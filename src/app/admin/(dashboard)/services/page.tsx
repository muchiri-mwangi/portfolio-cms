import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/lib/types";

export const metadata = { title: "Manage Services" };

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("services").select("*").order("created_at", { ascending: false });
  const services = (data ?? []) as Service[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Services</h1>
        <Link href="/admin/services/new" className="bg-primary rounded-full px-5 py-2.5 text-sm font-bold text-white">
          New service
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {services.map((s) => (
          <Link
            key={s.id}
            href={`/admin/services/${s.id}/edit`}
            className="border-theme hover:border-primary flex items-center justify-between rounded-xl border p-4"
          >
            <div>
              <p className="font-semibold">{s.title}</p>
              <p className="text-muted mt-0.5 text-xs">
                KES {Number(s.price_kes).toLocaleString()} · {s.delivery_days} day delivery
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                s.published ? "bg-green-100 text-green-700" : "bg-soft text-muted"
              }`}
            >
              {s.published ? "Live" : "Draft"}
            </span>
          </Link>
        ))}
        {services.length === 0 && (
          <p className="text-muted py-10 text-center text-sm">No services yet — add your first gig.</p>
        )}
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ServiceForm from "@/components/ServiceForm";
import { updateService, deleteService } from "../../actions";
import type { Service } from "@/lib/types";

export const metadata = { title: "Edit Service" };

export default async function EditServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;

  const supabase = await createClient();
  const { data: service } = await supabase.from("services").select("*").eq("id", id).single();
  if (!service) notFound();

  const updateServiceWithId = updateService.bind(null, id);
  const deleteServiceWithId = deleteService.bind(null, id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Edit service</h1>
        <form action={deleteServiceWithId}>
          <button type="submit" className="text-xs font-semibold text-red-600">
            Delete service
          </button>
        </form>
      </div>

      {saved && <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">Saved.</p>}
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <div className="mt-6 max-w-2xl">
        <ServiceForm service={service as Service} action={updateServiceWithId} />
      </div>
    </div>
  );
}

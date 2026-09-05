import ServiceForm from "@/components/ServiceForm";
import { createService } from "../actions";

export const metadata = { title: "New Service" };

export default async function NewServicePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-black">New service</h1>
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      <div className="mt-6 max-w-2xl">
        <ServiceForm action={createService} />
      </div>
    </div>
  );
}

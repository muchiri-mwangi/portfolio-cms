import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/data";
import { orderService } from "../actions";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  return { title: service?.title ?? "Service not found" };
}

export default async function ServiceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  const { error } = await searchParams;
  const service = await getServiceBySlug(slug);

  if (!service) notFound();

  const orderThisService = orderService.bind(null, service.id);

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="bg-soft aspect-square overflow-hidden rounded-2xl">
          {service.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={service.cover_image_url}
              alt={service.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="bg-accent/10 flex h-full w-full items-center justify-center text-6xl font-black text-accent/30">
              {service.title.charAt(0)}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-black">{service.title}</h1>
          <div className="mt-4 flex items-center gap-4">
            <p className="text-2xl font-black">KES {Number(service.price_kes).toLocaleString()}</p>
            <span className="text-muted text-sm">{service.delivery_days}-day delivery</span>
          </div>
          <p className="text-muted prose-content mt-4 whitespace-pre-line">{service.description}</p>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              Something went wrong creating your order — please try again.
            </p>
          )}

          <form action={orderThisService} className="border-theme mt-8 space-y-4 rounded-2xl border p-5">
            <div>
              <label className="text-sm font-semibold" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="requirements">
                Tell me what you need
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows={4}
                required
                placeholder="Describe your setup, goals, or brief so I can get started right away"
                className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="bg-primary w-full rounded-full py-3 text-sm font-bold text-white"
            >
              Order now — pay via M-Pesa or card
            </button>
            <p className="text-muted text-center text-xs">Secure checkout powered by IntaSend</p>
          </form>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { getPublishedServices } from "@/lib/data";

export const metadata = { title: "Services" };

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-primary text-sm font-bold uppercase tracking-widest">Services</p>
      <h1 className="mt-2 text-4xl font-black">Book my time directly</h1>
      <p className="text-muted mt-4 max-w-2xl text-lg">
        Networking, IT support, and AI data annotation — order below and I'll deliver within the stated timeframe.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Link
            key={s.id}
            href={`/services/${s.slug}`}
            className="group border-theme flex flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-lg"
          >
            <div className="bg-soft relative aspect-[4/3] w-full overflow-hidden">
              {s.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.cover_image_url}
                  alt={s.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="bg-accent/10 flex h-full w-full items-center justify-center text-4xl font-black text-accent/30">
                  {s.title.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <h3 className="font-bold group-hover:text-primary">{s.title}</h3>
              <p className="text-muted line-clamp-2 text-sm">{s.description}</p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <span className="font-black">KES {Number(s.price_kes).toLocaleString()}</span>
                <span className="text-muted text-xs">{s.delivery_days}-day delivery</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {services.length === 0 && (
        <p className="text-muted mt-16 text-center">
          Services are being set up — check back soon, or reach out via the contact page.
        </p>
      )}
    </div>
  );
}

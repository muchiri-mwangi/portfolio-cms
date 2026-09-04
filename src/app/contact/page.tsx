import { Mail, MapPin, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/data";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-primary text-sm font-bold uppercase tracking-widest">Contact</p>
      <h1 className="mt-2 text-4xl font-black">Let&apos;s work together</h1>
      <p className="text-muted mt-4 text-lg">
        Reach out about networking, IT support, data annotation, or a software project.
      </p>

      <div className="mt-10 space-y-4">
        {settings.email && (
          <a
            href={`mailto:${settings.email}`}
            className="border-theme flex items-center gap-4 rounded-xl border p-4 hover:border-primary"
          >
            <Mail className="text-primary" size={20} />
            <span className="font-medium">{settings.email}</span>
          </a>
        )}
        {settings.phone && (
          <a
            href={`tel:${settings.phone}`}
            className="border-theme flex items-center gap-4 rounded-xl border p-4 hover:border-primary"
          >
            <Phone className="text-primary" size={20} />
            <span className="font-medium">{settings.phone}</span>
          </a>
        )}
        {settings.location && (
          <div className="border-theme flex items-center gap-4 rounded-xl border p-4">
            <MapPin className="text-primary" size={20} />
            <span className="font-medium">{settings.location}</span>
          </div>
        )}
        {!settings.email && !settings.phone && (
          <p className="text-muted text-sm">
            Add your email and phone from the admin settings page so this shows up here.
          </p>
        )}
      </div>
    </div>
  );
}

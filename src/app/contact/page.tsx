import { Mail, MapPin, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/data";
import { sendContactMessage } from "./actions";

export const metadata = { title: "Contact" };

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const settings = await getSiteSettings();
  const { sent } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-primary text-sm font-bold uppercase tracking-widest">Contact</p>
      <h1 className="mt-2 text-4xl font-black">Let&apos;s work together</h1>
      <p className="text-muted mt-4 text-lg">
        Reach out about networking, IT support, data annotation, or a software project.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
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

        <div>
          {sent && (
            <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              Message sent — thanks, I&apos;ll get back to you soon.
            </p>
          )}
          <form action={sendContactMessage} className="space-y-4">
            <div>
              <label className="text-sm font-semibold" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 outline-none focus:border-primary"
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
                className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="bg-primary rounded-full px-6 py-2.5 text-sm font-bold text-white"
            >
              Send message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Cpu, Database, Network, Tags, Wrench, Globe } from "lucide-react";

export const metadata = { title: "Services" };

const services = [
  {
    icon: Network,
    title: "Network Design & Setup",
    desc: "Planning, installing, and managing computer networks — wired and wireless — for homes, offices, and small businesses.",
  },
  {
    icon: Wrench,
    title: "Computer Repair & Maintenance",
    desc: "Diagnostics, hardware repair, software troubleshooting, and preventive maintenance to keep your equipment reliable.",
  },
  {
    icon: Tags,
    title: "AI Data Annotation",
    desc: "Accurate labeling and annotation of text, image, and other data for machine learning training pipelines.",
  },
  {
    icon: Database,
    title: "Database & Software Management",
    desc: "Building and maintaining databases and custom software tools that fit how your business actually works.",
  },
  {
    icon: Cpu,
    title: "IT Technical Support",
    desc: "Ongoing, dependable support for the everyday technical issues that slow a business down.",
  },
  {
    icon: Globe,
    title: "Web Development",
    desc: "Websites and web applications, from simple business sites to full platforms with custom features.",
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-primary text-sm font-bold uppercase tracking-widest">Services</p>
      <h1 className="mt-2 text-4xl font-black">How I can help</h1>
      <p className="text-muted mt-4 max-w-2xl text-lg">
        A mix of hands-on technical work and the precision data work that AI
        systems depend on.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s.title} className="border-theme rounded-2xl border p-6">
            <s.icon className="text-primary" size={28} />
            <h3 className="mt-4 font-bold">{s.title}</h3>
            <p className="text-muted mt-2 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-soft mt-16 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-black">Have a project in mind?</h2>
        <p className="text-muted mt-2">Let&apos;s talk about what you need.</p>
        <Link
          href="/contact"
          className="bg-primary mt-6 inline-block rounded-full px-6 py-3 text-sm font-bold text-white"
        >
          Get in touch
        </Link>
      </div>
    </div>
  );
}

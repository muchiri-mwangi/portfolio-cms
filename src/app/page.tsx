import Link from "next/link";
import { ArrowRight, Cpu, Network, Tags, Wrench } from "lucide-react";
import { getPublishedPosts, getSiteSettings } from "@/lib/data";
import PostCard from "@/components/PostCard";

const skills = [
  {
    icon: Network,
    title: "Networking & IT Support",
    desc: "Network design, setup & management, computer repair, and technical support.",
  },
  {
    icon: Tags,
    title: "AI Data Annotation",
    desc: "High-quality data labeling and annotation for AI/ML training pipelines.",
  },
  {
    icon: Cpu,
    title: "Software Development",
    desc: "Web apps, databases, and automation tools built end to end.",
  },
  {
    icon: Wrench,
    title: "Hands-on Technician Work",
    desc: "Hardware diagnostics, installation, and maintenance — off-grid solar included.",
  },
];

const projects = [
  {
    name: "SomaPass",
    desc: "A CDACC exam revision platform helping Kenyan TVET students prepare with confidence.",
    href: "https://somapass.co.ke",
  },
  {
    name: "Duka Smart",
    desc: "A multi-platform shop management system built for Kenyan village dukas.",
  },
  {
    name: "Shamba Smart Advisor",
    desc: "An agricultural decision-support system helping Murang'a farmers plan smarter.",
  },
];

export default async function HomePage() {
  const settings = await getSiteSettings();
  const posts = (await getPublishedPosts()).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-14 md:grid-cols-2 md:pt-24">
        <div>
          <p className="text-primary mb-3 text-sm font-bold uppercase tracking-widest">
            {settings.tagline}
          </p>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
            {settings.site_name}
          </h1>
          <p className="text-muted mt-6 max-w-lg text-lg">
            {settings.bio || "Blending hands-on technical skill with precision AI data annotation — building the infrastructure and data behind smarter systems."}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="bg-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white"
            >
              Work with me <ArrowRight size={16} />
            </Link>
            <Link
              href="/projects"
              className="border-theme inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold"
            >
              View projects
            </Link>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <div className="bg-primary absolute -right-4 -top-4 h-full w-full rounded-3xl opacity-10" />
          {settings.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.avatar_url}
              alt={settings.site_name}
              className="relative h-full w-full rounded-3xl object-cover shadow-xl"
            />
          ) : (
            <div className="bg-accent relative flex h-full w-full items-center justify-center rounded-3xl text-6xl font-black text-white shadow-xl">
              {settings.site_name.charAt(0)}
            </div>
          )}
        </div>
      </section>

      {/* Skills */}
      <section className="bg-soft py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-2xl font-black md:text-3xl">What I do</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((s) => (
              <div key={s.title} className="rounded-2xl bg-[var(--color-bg)] p-6">
                <s.icon className="text-primary" size={28} />
                <h3 className="mt-4 font-bold">{s.title}</h3>
                <p className="text-muted mt-2 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects preview */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-black md:text-3xl">Featured projects</h2>
          <Link href="/projects" className="text-primary text-sm font-semibold">
            See all →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {projects.map((p) => (
            <div key={p.name} className="border-theme rounded-2xl border p-6">
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-muted mt-2 text-sm">{p.desc}</p>
              {p.href && (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary mt-4 inline-block text-sm font-semibold"
                >
                  Visit site →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Latest posts */}
      {posts.length > 0 && (
        <section className="bg-soft py-16">
          <div className="mx-auto max-w-6xl px-5">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-black md:text-3xl">From the blog</h2>
              <Link href="/blog" className="text-primary text-sm font-semibold">
                All posts →
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

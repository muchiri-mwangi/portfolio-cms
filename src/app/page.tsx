import Link from "next/link";
import { Cpu, Network, Tags, Wrench } from "lucide-react";
import { getPublishedPosts, getSiteSettings } from "@/lib/data";
import PostCard from "@/components/PostCard";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";

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
      <Hero settings={settings} />

      {/* Skills */}
      <section className="bg-soft py-16">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <h2 className="text-2xl font-black md:text-3xl">What I do</h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl bg-[var(--color-bg)] p-6">
                  <s.icon className="text-primary" size={28} />
                  <h3 className="mt-4 font-bold">{s.title}</h3>
                  <p className="text-muted mt-2 text-sm">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Projects preview */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-black md:text-3xl">Featured projects</h2>
            <Link href="/projects" className="text-primary text-sm font-semibold">
              See all →
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <div className="border-theme h-full rounded-2xl border p-6">
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
            </Reveal>
          ))}
        </div>
      </section>

      {/* Marketplace teaser */}
      <section className="bg-accent mx-5 rounded-3xl px-8 py-14 text-center text-white md:mx-auto md:max-w-6xl">
        <Reveal>
          <h2 className="text-2xl font-black md:text-3xl">Templates & ebooks, ready to use</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Digital products built from real project experience — grab a template or ebook and skip the guesswork.
          </p>
          <Link
            href="/marketplace"
            className="bg-primary mt-6 inline-block rounded-full px-6 py-3 text-sm font-bold text-white"
          >
            Browse the marketplace
          </Link>
        </Reveal>
      </section>

      {/* Latest posts */}
      {posts.length > 0 && (
        <section className="bg-soft mt-16 py-16">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal>
              <div className="flex items-end justify-between">
                <h2 className="text-2xl font-black md:text-3xl">From Muchiri, the blog</h2>
                <Link href="/blog" className="text-primary text-sm font-semibold">
                  All posts →
                </Link>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={i * 0.08}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

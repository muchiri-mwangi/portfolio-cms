export const metadata = { title: "Projects" };

const projects = [
  {
    name: "SomaPass",
    desc: "A CDACC exam revision platform helping Kenyan TVET students prepare for their exams with structured practice content.",
    href: "https://somapass.co.ke",
    tags: ["Education", "Web App"],
  },
  {
    name: "Duka Smart",
    desc: "A multi-platform shop management system built for Kenyan village dukas — inventory, sales, and day-to-day operations in one place.",
    tags: ["Small Business", "Multi-platform"],
  },
  {
    name: "Shamba Smart Advisor",
    desc: "A Laravel-based agricultural decision-support system helping Murang'a farmers make better planting and management decisions.",
    tags: ["Agriculture", "Laravel"],
  },
  {
    name: "Solar System Design & Monitoring",
    desc: "A PHP-based system for designing and monitoring solar power setups — built from real off-grid experience.",
    tags: ["Solar", "PHP"],
  },
];

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-primary text-sm font-bold uppercase tracking-widest">Projects</p>
      <h1 className="mt-2 text-4xl font-black">Things I&apos;ve built</h1>
      <p className="text-muted mt-4 max-w-2xl text-lg">
        A mix of software projects — most of them solving problems for people
        around me in Murang&apos;a and beyond.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {projects.map((p) => (
          <div key={p.name} className="border-theme rounded-2xl border p-6">
            <h3 className="text-xl font-bold">{p.name}</h3>
            <p className="text-muted mt-3">{p.desc}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="bg-soft rounded-full px-3 py-1 text-xs font-semibold text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
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
    </div>
  );
}

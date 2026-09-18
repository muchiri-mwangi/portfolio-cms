import { getSiteSettings } from "@/lib/data";

export const metadata = { title: "About" };
export const revalidate = 60;

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-primary text-sm font-bold uppercase tracking-widest">About</p>
      <h1 className="mt-2 text-4xl font-black">{settings.site_name}</h1>
      <p className="text-muted mt-4 text-lg">{settings.tagline}</p>

      <div className="prose-content mt-10">
        <p>{settings.bio || "Add your full bio from the admin settings page."}</p>
      </div>

      <div className="border-theme mt-12 grid gap-6 border-t pt-10 sm:grid-cols-2">
        <div>
          <h3 className="font-bold">Technician background</h3>
          <p className="text-muted mt-2 text-sm">
            Trained in computer networking, network design & management, computer
            repair and maintenance, and IT technical support — with real-world
            experience keeping systems running, including fully off-grid solar
            setups.
          </p>
        </div>
        <div>
          <h3 className="font-bold">AI & data annotation</h3>
          <p className="text-muted mt-2 text-sm">
            Focused on the data side of AI: labeling, annotating, and reviewing
            training data so machine learning systems learn from clean,
            well-structured examples.
          </p>
        </div>
      </div>

      {settings.location && (
        <p className="text-muted mt-10 text-sm">Based in {settings.location}.</p>
      )}
    </div>
  );
}

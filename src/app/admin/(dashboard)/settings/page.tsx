import { getSiteSettings } from "@/lib/data";
import SettingsForm from "@/components/SettingsForm";
import { updateSettings } from "./actions";

export const metadata = { title: "Theme & Settings" };

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-black">Theme & settings</h1>
      <p className="text-muted mt-1 text-sm">
        Change your site&apos;s colors, bio, and contact details any time.
      </p>

      {saved && (
        <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">Saved.</p>
      )}
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-6 max-w-2xl">
        <SettingsForm settings={settings} action={updateSettings} />
      </div>
    </div>
  );
}

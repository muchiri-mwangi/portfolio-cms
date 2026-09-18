import HoneypotField from "@/components/HoneypotField";
import { requestMagicLink } from "./actions";

export const metadata = { title: "Sign in" };

export default async function AccountLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string; limited?: string }>;
}) {
  const { sent, error, limited } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <h1 className="text-2xl font-black">Sign in</h1>
      <p className="text-muted mt-2 text-sm">
        Enter the email you used when you bought something — we&apos;ll send you a link, no
        password needed.
      </p>

      {sent && (
        <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          Check your inbox — click the link we just sent to sign in. It may take a minute or
          land in spam.
        </p>
      )}
      {limited && (
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
          Too many attempts from this email — please try again shortly.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <form action={requestMagicLink} className="mt-8 space-y-4">
        <HoneypotField />
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
        <button
          type="submit"
          className="bg-primary w-full rounded-lg py-2.5 font-bold text-white"
        >
          Send sign-in link
        </button>
      </form>
    </div>
  );
}

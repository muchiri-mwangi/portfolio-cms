import { login } from "./actions";

export const metadata = { title: "Admin Login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <h1 className="text-2xl font-black">Admin login</h1>
      <p className="text-muted mt-2 text-sm">
        Sign in to manage your posts, categories, and site theme.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <form action={login} className="mt-8 space-y-4">
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
          <label className="text-sm font-semibold" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="border-theme mt-1 w-full rounded-lg border px-4 py-2.5 outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="bg-primary w-full rounded-lg py-2.5 font-bold text-white"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

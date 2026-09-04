# Portfolio + Blog CMS

A personal portfolio site (technician + AI data annotation specialist) with a
built-in admin dashboard for writing blog posts, managing categories, and
changing the site theme — no code editing required after setup.

**Stack:** Next.js (App Router) + Tailwind CSS + Supabase (database, auth,
storage). Free to host on Vercel + Supabase's free tiers.

## 1. Create your Supabase project (free)

1. Go to https://supabase.com and create a new project.
2. Once it's ready, open **Project Settings -> API** and copy:
   - Project URL
   - `anon` `public` API key
3. Open the **SQL Editor** in Supabase, paste the entire contents of
   [`supabase/schema.sql`](./supabase/schema.sql), and run it. This creates:
   - `posts`, `categories`, `site_settings` tables
   - Row Level Security so only you (logged in) can write, everyone can read
     published content
   - A public `media` storage bucket for cover images / your photo
   - Three starter categories you can rename or delete

## 2. Create your admin login

You log in with a normal Supabase user — no separate signup page (keeps
random people from creating accounts).

1. In Supabase, go to **Authentication -> Users -> Add user**.
2. Create yourself a user with your email + a password. Confirm the email
   automatically (toggle "Auto Confirm User" if shown).
3. That email + password is what you'll use to log in at `/admin/login`.

## 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the two values from step 1:

```
cp .env.example .env.local
```

## 4. Run locally

```
npm install
npm run dev
```

Visit http://localhost:3000 for the public site, and
http://localhost:3000/admin/login to log in.

## 5. Deploy for free (Vercel)

1. Push this repo to GitHub (already done if you're reading this on GitHub).
2. Go to https://vercel.com, sign in with GitHub, and import this repo.
3. In the Vercel project's **Environment Variables**, add the same two
   variables from `.env.local`.
4. Deploy. You'll get a free `your-project.vercel.app` URL — you can attach a
   custom domain later for free (you just pay for the domain itself).

## Using the admin dashboard

Once deployed, go to `/admin/login` and sign in.

- **Dashboard** — quick stats on your posts.
- **Posts** — write new posts in Markdown, upload a cover image, assign a
  category, and toggle Published/Draft. Drafts never show on the public site.
- **Categories** — add/remove the field categories your posts are grouped
  under (e.g. "IT & Networking", "AI & Data Annotation").
- **Theme & Settings** — pick a color preset or set your own primary/accent
  colors, toggle dark mode, upload your photo, and edit your bio and contact
  details. Changes apply across the whole site immediately.

## Project structure

```
src/app/            public pages + admin dashboard (Next.js App Router)
src/components/     shared UI (Navbar, Footer, PostForm, SettingsForm, ...)
src/lib/            Supabase clients, data-fetching helpers, TS types
supabase/schema.sql database schema — run this once in Supabase
```

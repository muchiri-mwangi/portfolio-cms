# Portfolio + Blog CMS + Marketplace

A personal portfolio site (technician + AI data annotation specialist) with:

- A built-in admin dashboard for writing blog posts ("Muchiri"), managing
  categories, and changing the site theme
- A digital products marketplace (templates, ebooks) with M-Pesa/card
  checkout via IntaSend
- A contact form wired to Zapier
- Animated hero, scroll reveals, and a custom wildlife cursor
- Privacy Policy / Terms pages for AdSense eligibility

**Stack:** Next.js (App Router) + Tailwind CSS + Framer Motion + Supabase
(database, auth, storage) + IntaSend (payments). Free to host on Vercel +
Supabase's free tiers; IntaSend charges a small fee per transaction only.

## 1. Create your Supabase project (free)

1. Go to https://supabase.com and create a new project.
2. Open **Project Settings -> API** and copy:
   - Project URL
   - `anon` `public` API key
   - `service_role` key (keep this one secret — server only)
3. Open the **SQL Editor** and run these three files in order, pasting each
   one's full contents and running it:
   1. [`supabase/schema.sql`](./supabase/schema.sql) — posts, categories,
      site settings, media storage
   2. [`supabase/002_updates.sql`](./supabase/002_updates.sql) — blog brand
      name + newsletter subscribers
   3. [`supabase/003_marketplace.sql`](./supabase/003_marketplace.sql) —
      products, orders, private file storage
   4. [`supabase/004_marketplace_extras.sql`](./supabase/004_marketplace_extras.sql) —
      marketplace categories, discount codes, reviews, and the services
      (gig) platform

## 2. Create your admin login

1. In Supabase: **Authentication -> Users -> Add user**.
2. Create yourself a user with your email + a password (auto-confirm it).
3. That's your login at `/admin/login`.

## 3. Set up IntaSend (payments)

1. Sign up at https://intasend.com and grab your **sandbox** API keys first
   (Settings -> API Keys) to test end to end before going live.
2. Add `INTASEND_PUBLISHABLE_KEY` and leave `INTASEND_TEST_MODE=true` while
   testing. Switch to live keys and `INTASEND_TEST_MODE=false` when ready.
3. In IntaSend's dashboard, add a webhook pointing to
   `https://your-site.vercel.app/api/webhooks/intasend` and set a challenge
   string — put the same string in `INTASEND_WEBHOOK_CHALLENGE`. This is how
   an order gets marked "paid" and unlocks the download automatically.

## 4. Set up the Zapier contact form

1. In Zapier, create a Zap that starts with **Webhooks by Zapier -> Catch
   Hook**. Copy the webhook URL it gives you.
2. Paste that into `ZAPIER_CONTACT_WEBHOOK_URL`.
3. Add a second Zap step — e.g. **Email by Zapier** or **Gmail: Send Email**
   — to forward the message to your inbox (the payload includes `name`,
   `email`, and `message`).

## 5. Configure environment variables

```
cp .env.example .env.local
```

Fill in every value described above.

## 6. Run locally

```
npm install
npm run dev
```

Visit http://localhost:3000, and http://localhost:3000/admin/login to log in.

## 7. Deploy for free (Vercel)

1. Import this repo at https://vercel.com.
2. Add all the environment variables from `.env.local`, using your real
   production `NEXT_PUBLIC_SITE_URL`.
3. Deploy — you'll get a free `.vercel.app` URL (attach a custom domain
   later if you want one).
4. Update the IntaSend webhook URL and `NEXT_PUBLIC_SITE_URL` to match your
   real deployed domain once it's live.

## Using the admin dashboard

- **Dashboard** — quick stats.
- **Posts** — Markdown editor, cover image, category, draft/publish. Embed a
  live product grid inside any post with `[[products:category-slug]]`.
- **Categories** — your blog's field categories.
- **Products** — templates/ebooks: title, description, category, price,
  optional "original price" for a strikethrough discount, cover image, and
  the private deliverable file.
- **Shop Categories** — categories for the marketplace (separate from blog
  categories).
- **Services (Gigs)** — offer your time directly: title, description,
  price, delivery time. Buyers submit a brief and pay up front.
- **Orders** — every marketplace purchase and every service order in one
  place. For service orders, mark "in progress" and upload the finished
  file + a note to mark it delivered — the buyer sees it on their order page.
- **Customers** — everyone who's bought something, with total spend.
- **Discounts** — create a code (percent or flat KES off, optional expiry
  or usage limit); buyers enter it at marketplace checkout.
- **Reviews** — approve or delete reviews before they show on a product
  page.
- **Theme & Settings** — color presets or custom colors, dark mode, your
  photo, bio, blog brand name ("Muchiri" by default), and contact info.

## SEO

A dynamic `sitemap.xml` and `robots.txt` are generated automatically from
your published posts, products, and services, and pages carry Open Graph /
Twitter card metadata plus JSON-LD structured data (Product, Article) so
search engines and social previews pick up real content. Once deployed,
submit your sitemap (`https://your-site/sitemap.xml`) in Google Search
Console.

## How the marketplace works

1. A buyer picks a product and enters their email.
2. They're redirected to IntaSend's hosted checkout (M-Pesa STK push or
   card).
3. IntaSend calls your webhook when payment completes, which marks the
   order "paid".
4. The buyer lands back on `/marketplace/order/[id]`, which shows a
   time-limited download link once payment is confirmed.

## Legal pages

`/privacy-policy` and `/terms-of-service` are starting templates required
for AdSense approval — read through and customize them (dates, business
name, specifics) before applying, and consider having them reviewed.

## Project structure

```
src/app/                    public pages + admin dashboard + marketplace
src/app/api/webhooks/       IntaSend payment webhook
src/components/             shared UI (Navbar, Hero, PostForm, ProductForm, CustomCursor, ...)
src/lib/                    Supabase clients, IntaSend client, data helpers, types
supabase/*.sql               run these in order in the Supabase SQL Editor
```

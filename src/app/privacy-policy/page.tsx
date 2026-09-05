export const metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-primary text-sm font-bold uppercase tracking-widest">Legal</p>
      <h1 className="mt-2 text-4xl font-black">Privacy Policy</h1>
      <p className="text-muted mt-2 text-sm">Last updated: [add date]</p>

      <div className="prose-content mt-10">
        <p>
          <em>
            This is a starting template, not legal advice — review and customize it
            (or have a lawyer review it) before relying on it, especially the sections
            on advertising and payments.
          </em>
        </p>

        <h2>What this site is</h2>
        <p>
          This website is operated by [Your Name / Business Name] (&quot;we&quot;,
          &quot;us&quot;). This policy explains what information we collect when you
          visit this site, use the blog, or buy a digital product from the
          marketplace, and how we use it.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>Contact form submissions: your name, email, and message.</li>
          <li>
            Marketplace purchases: your name, email, and payment details processed by
            our payment provider, IntaSend — we do not store your card or M-Pesa
            details ourselves.
          </li>
          <li>
            Usage data collected automatically via cookies and similar technologies,
            including for advertising (see below).
          </li>
        </ul>

        <h2>Advertising and cookies</h2>
        <p>
          This site may show ads served by Google AdSense. Google and its partners
          use cookies to serve ads based on your prior visits to this website or
          other websites. You can opt out of personalized advertising by visiting
          Google&apos;s Ads Settings. Third-party vendors, including Google, use
          cookies to serve ads based on someone&apos;s prior visits to this site.
        </p>

        <h2>How we use your information</h2>
        <ul>
          <li>To respond to messages sent through the contact form.</li>
          <li>To process and deliver digital products you purchase.</li>
          <li>To improve the site and understand how it&apos;s used.</li>
        </ul>

        <h2>Third parties we work with</h2>
        <p>
          We use Supabase for hosting our database and files, IntaSend for payment
          processing, and Zapier to route contact form submissions. Each of these
          providers has its own privacy policy governing how they handle data on our
          behalf.
        </p>

        <h2>Your choices</h2>
        <p>
          You can contact us at any time to ask what information we hold about you
          or to request it be deleted, subject to what we&apos;re required to keep
          for accounting/legal purposes.
        </p>

        <h2>Contact</h2>
        <p>Questions about this policy? Reach out via the contact page.</p>
      </div>
    </div>
  );
}

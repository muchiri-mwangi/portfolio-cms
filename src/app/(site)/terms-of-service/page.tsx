export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-primary text-sm font-bold uppercase tracking-widest">Legal</p>
      <h1 className="mt-2 text-4xl font-black">Terms of Service</h1>
      <p className="text-muted mt-2 text-sm">Last updated: [add date]</p>

      <div className="prose-content mt-10">
        <p>
          <em>
            This is a starting template, not legal advice — review and customize it
            before relying on it.
          </em>
        </p>

        <h2>Using this site</h2>
        <p>
          By using this website you agree to these terms. If you don&apos;t agree,
          please don&apos;t use the site.
        </p>

        <h2>Digital products</h2>
        <ul>
          <li>
            Products sold in the marketplace (templates, ebooks) are for your own
            use. Reselling, redistributing, or claiming them as your own work is not
            allowed unless a listing says otherwise.
          </li>
          <li>
            Because these are digital downloads, sales are generally final once the
            file has been delivered — contact us if something&apos;s wrong with your
            order and we&apos;ll sort it out.
          </li>
          <li>Prices are shown in Kenyan Shillings (KES) unless stated otherwise.</li>
        </ul>

        <h2>Blog content</h2>
        <p>
          Articles on this site reflect personal experience and opinion. They&apos;re
          shared for informational purposes and aren&apos;t professional advice
          specific to your situation.
        </p>

        <h2>Liability</h2>
        <p>
          This site and its products are provided &quot;as is&quot;. We work to keep
          everything accurate and functioning, but we&apos;re not liable for
          indirect or incidental damages from using the site or its products, to the
          extent permitted by law.
        </p>

        <h2>Changes</h2>
        <p>
          These terms may be updated from time to time. Continued use of the site
          after changes means you accept the updated terms.
        </p>

        <h2>Contact</h2>
        <p>Questions? Reach out via the contact page.</p>
      </div>
    </div>
  );
}

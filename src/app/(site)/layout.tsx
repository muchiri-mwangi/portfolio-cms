import type { Metadata } from "next";
import Script from "next/script";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeVars from "@/components/ThemeVars";
import CustomCursor from "@/components/CustomCursor";
import { getSiteSettings } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const title = `${settings.site_name} — ${settings.tagline}`;

  const other: Record<string, string> = {};
  if (settings.bing_site_verification) other["msvalidate.01"] = settings.bing_site_verification;
  if (settings.facebook_domain_verification) {
    other["facebook-domain-verification"] = settings.facebook_domain_verification;
  }

  return {
    metadataBase: new URL(siteUrl),
    title,
    description: settings.bio,
    // "./" resolves to each page's own URL, so every page gets a correct
    // self-referencing canonical tag without per-page configuration.
    alternates: { canonical: "./" },
    verification: {
      google: settings.google_site_verification ?? undefined,
      other: Object.keys(other).length ? other : undefined,
    },
    openGraph: {
      title,
      description: settings.bio,
      siteName: settings.site_name,
      images: settings.avatar_url ? [settings.avatar_url] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: settings.bio,
      images: settings.avatar_url ? [settings.avatar_url] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const adsOn = settings.ads_enabled && Boolean(settings.adsense_publisher_id);

  return (
    <html
      lang="en"
      data-theme={settings.dark_mode ? "dark" : "light"}
      data-custom-cursor
      className="h-full"
    >
      <head>
        <ThemeVars settings={settings} />
      </head>
      <body className="flex min-h-full flex-col font-sans antialiased">
        {settings.google_analytics_id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${settings.google_analytics_id}');`}
            </Script>
          </>
        )}
        {adsOn && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.adsense_publisher_id}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <CustomCursor />
        <Navbar settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}

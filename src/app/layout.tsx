import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeVars from "@/components/ThemeVars";
import { getSiteSettings } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `${settings.site_name} — ${settings.tagline}`,
    description: settings.bio,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" data-theme={settings.dark_mode ? "dark" : "light"} className="h-full">
      <head>
        <ThemeVars settings={settings} />
      </head>
      <body className="flex min-h-full flex-col font-sans antialiased">
        <Navbar settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}

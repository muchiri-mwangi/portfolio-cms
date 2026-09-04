"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative overflow-hidden">
      {/* floating gradient blobs */}
      <motion.div
        aria-hidden
        className="bg-primary/20 pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full blur-3xl"
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="bg-accent/20 pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full blur-3xl"
        animate={{ y: [0, -24, 0], x: [0, -16, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-14 md:grid-cols-2 md:pt-24"
      >
        <div>
          <motion.p
            variants={item}
            className="text-primary mb-3 text-sm font-bold uppercase tracking-widest"
          >
            {settings.tagline}
          </motion.p>
          <motion.h1
            variants={item}
            className="text-4xl font-black leading-[1.05] tracking-tight md:text-6xl"
          >
            {settings.site_name}
          </motion.h1>
          <motion.p variants={item} className="text-muted mt-6 max-w-lg text-lg">
            {settings.bio ||
              "Blending hands-on technical skill with precision AI data annotation — building the infrastructure and data behind smarter systems."}
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="bg-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
            >
              Work with me <ArrowRight size={16} />
            </Link>
            <Link
              href="/marketplace"
              className="border-theme inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold transition-transform hover:scale-105"
            >
              Shop templates & ebooks
            </Link>
          </motion.div>
        </div>

        <motion.div
          variants={item}
          className="relative mx-auto aspect-square w-full max-w-sm"
        >
          <motion.div
            aria-hidden
            className="bg-primary absolute -right-4 -top-4 h-full w-full rounded-3xl opacity-10"
            animate={{ rotate: [0, 4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          {settings.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.avatar_url}
              alt={settings.site_name}
              className="relative h-full w-full rounded-3xl object-cover shadow-xl"
            />
          ) : (
            <div className="bg-accent relative flex h-full w-full items-center justify-center rounded-3xl text-6xl font-black text-white shadow-xl">
              {settings.site_name.charAt(0)}
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

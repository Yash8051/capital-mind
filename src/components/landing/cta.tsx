// ============================================================
// CapitalMind AI — CTA Section
// ============================================================

"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Start your first analysis
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to make smarter
            <br />
            investment decisions?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
            Enter any publicly traded company and get a comprehensive AI-powered
            investment analysis in under 60 seconds.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-indigo-700 shadow-xl transition-all hover:shadow-2xl hover:brightness-95"
            >
              Launch Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

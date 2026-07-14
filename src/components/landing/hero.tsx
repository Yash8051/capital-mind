// ============================================================
// CapitalMind AI — Hero Section
// ============================================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Search, Sparkles, ArrowRight, TrendingUp, Shield, Brain } from "lucide-react";

export function Hero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleAnalyze = () => {
    if (query.trim()) {
      router.push(`/dashboard?company=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 via-white to-white dark:from-indigo-950/30 dark:via-slate-950 dark:to-slate-950" />
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-400/20 to-violet-400/20 blur-3xl dark:from-indigo-600/10 dark:to-violet-600/10" />
        <div className="absolute right-0 top-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-amber-400/10 to-orange-400/10 blur-3xl" />

        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:border-indigo-800/50 dark:bg-indigo-950/50 dark:text-indigo-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Powered by Multi-Agent AI Architecture
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            AI-Powered{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
              Investment
            </span>
            <br />
            Intelligence
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400"
          >
            7 specialized AI agents analyze companies in parallel — from financials
            to sentiment to risk — producing institutional-grade investment
            research in seconds.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mt-10 max-w-xl"
          >
            <div className="group relative flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:focus-within:border-indigo-500">
              <Search className="ml-4 h-5 w-5 shrink-0 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                placeholder="Enter a company name (e.g., Apple, Tesla, NVIDIA)..."
                className="w-full bg-transparent px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
                id="hero-search"
              />
              <button
                onClick={handleAnalyze}
                disabled={!query.trim()}
                className="mr-2 flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:brightness-110 disabled:opacity-50 disabled:shadow-none"
              >
                Analyze
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mx-auto mt-12 flex max-w-lg flex-wrap items-center justify-center gap-8"
          >
            {[
              { icon: Brain, label: "7 AI Agents", sublabel: "Parallel analysis" },
              { icon: TrendingUp, label: "50+ Metrics", sublabel: "Financial data" },
              { icon: Shield, label: "Risk Engine", sublabel: "6 risk categories" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                  <stat.icon className="h-5 w-5 text-indigo-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {stat.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {stat.sublabel}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

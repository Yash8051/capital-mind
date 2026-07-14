// ============================================================
// CapitalMind AI — Features Section
// ============================================================

"use client";

import { motion } from "motion/react";
import {
  Brain,
  TrendingUp,
  Newspaper,
  Users,
  ShieldAlert,
  FileText,
  Zap,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Multi-Agent AI System",
    description:
      "7 specialized AI agents run in parallel using LangGraph, each analyzing a different dimension of the investment opportunity.",
    color: "from-indigo-500 to-violet-600",
    shadowColor: "shadow-indigo-500/20",
  },
  {
    icon: TrendingUp,
    title: "Financial Deep Dive",
    description:
      "Comprehensive analysis of revenue growth, margins, EPS, P/E ratio, cash flow, ROE, and 10+ key financial metrics.",
    color: "from-emerald-500 to-teal-600",
    shadowColor: "shadow-emerald-500/20",
  },
  {
    icon: Newspaper,
    title: "Sentiment Analysis",
    description:
      "Real-time news analysis with NLP-powered sentiment classification — positive, neutral, or negative — with impact scoring.",
    color: "from-amber-500 to-orange-600",
    shadowColor: "shadow-amber-500/20",
  },
  {
    icon: Users,
    title: "Competitor Intelligence",
    description:
      "Identifies top competitors, compares market share, revenue growth, and determines your company's competitive moat.",
    color: "from-rose-500 to-pink-600",
    shadowColor: "shadow-rose-500/20",
  },
  {
    icon: ShieldAlert,
    title: "Risk Assessment Engine",
    description:
      "Evaluates 6 risk categories — market, financial, industry, regulatory, valuation, and competition — with mitigating factors.",
    color: "from-cyan-500 to-blue-600",
    shadowColor: "shadow-cyan-500/20",
  },
  {
    icon: Zap,
    title: "Investment Committee",
    description:
      "Four AI-powered legendary investors (Buffett, Lynch, Dalio, Wood) deliberate and produce a consensus recommendation.",
    color: "from-purple-500 to-fuchsia-600",
    shadowColor: "shadow-purple-500/20",
  },
  {
    icon: BarChart3,
    title: "Interactive Charts",
    description:
      "Revenue trends, sentiment distribution, competitor comparison, risk radar, and investment score gauge — all beautifully visualized.",
    color: "from-sky-500 to-indigo-600",
    shadowColor: "shadow-sky-500/20",
  },
  {
    icon: FileText,
    title: "PDF Report Export",
    description:
      "Download a professional, comprehensive investment research report with executive summary, SWOT analysis, and recommendation.",
    color: "from-slate-500 to-slate-700",
    shadowColor: "shadow-slate-500/20",
  },
];

export function Features() {
  return (
    <section className="relative py-24" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Institutional-Grade Research,{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
              In Seconds
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400">
            Every analysis runs through a sophisticated multi-agent pipeline,
            combining real-time data with AI reasoning.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50"
            >
              {/* Icon */}
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg ${feature.shadowColor} transition-transform group-hover:scale-110`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>

              {/* Hover glow */}
              <div
                className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${feature.color} opacity-0 blur-2xl transition-opacity group-hover:opacity-10`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

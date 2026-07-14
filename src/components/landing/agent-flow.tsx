// ============================================================
// CapitalMind AI — Agent Flow Visualization
// ============================================================

"use client";

import { motion } from "motion/react";
import {
  Brain,
  Building2,
  TrendingUp,
  Newspaper,
  Users,
  ShieldAlert,
  Gavel,
  ArrowDown,
  ArrowRight,
} from "lucide-react";

const parallelAgents = [
  { icon: Building2, name: "Company Research", color: "bg-blue-500" },
  { icon: TrendingUp, name: "Financial Analyst", color: "bg-emerald-500" },
  { icon: Newspaper, name: "News Sentiment", color: "bg-amber-500" },
  { icon: Users, name: "Competitor Analysis", color: "bg-rose-500" },
  { icon: ShieldAlert, name: "Risk Assessment", color: "bg-cyan-500" },
];

export function AgentFlow() {
  return (
    <section className="relative py-24 bg-slate-50 dark:bg-slate-900/50" id="architecture">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
            Architecture
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Multi-Agent{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
              Workflow
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400">
            Powered by LangGraph, our agents coordinate in a fan-out/fan-in
            pattern for maximum speed and accuracy.
          </p>
        </motion.div>

        {/* Flow Diagram */}
        <div className="mt-16 flex flex-col items-center gap-6">
          {/* User Input */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              User Input → &quot;Analyze Apple&quot;
            </span>
          </motion.div>

          <ArrowDown className="h-6 w-6 text-slate-400" />

          {/* Supervisor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 rounded-xl border-2 border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 px-6 py-3 shadow-lg shadow-indigo-500/10"
          >
            <Brain className="h-5 w-5 text-indigo-500" />
            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
              Supervisor Agent
            </span>
          </motion.div>

          <ArrowDown className="h-6 w-6 text-slate-400" />

          {/* Parallel Agents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <div className="mb-3 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Parallel Execution
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {parallelAgents.map((agent, i) => (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${agent.color}`}
                  >
                    <agent.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-center text-xs font-medium text-slate-700 dark:text-slate-300">
                    {agent.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <ArrowDown className="h-6 w-6 text-slate-400" />

          {/* Investment Committee */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 rounded-xl border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-6 py-3 shadow-lg shadow-amber-500/10"
          >
            <Gavel className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
              Investment Committee
            </span>
            <span className="text-xs text-amber-600/80 dark:text-amber-400/80">
              (Buffett · Lynch · Dalio · Wood)
            </span>
          </motion.div>

          <ArrowDown className="h-6 w-6 text-slate-400" />

          {/* Output */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-8 py-4 shadow-xl shadow-indigo-500/25"
          >
            <div className="text-center text-white">
              <p className="text-sm font-medium opacity-80">Final Output</p>
              <p className="mt-0.5 text-lg font-bold">
                INVEST · 82/100 · 87% Confidence
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-white/60" />
            <span className="rounded-lg bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur">
              PDF Report
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CapitalMind AI — Investment Thesis (Bull/Bear)
// ============================================================

"use client";

import { motion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { InvestmentDecision } from "@/types";

interface InvestmentThesisProps {
  data: InvestmentDecision;
}

export function InvestmentThesis({ data }: InvestmentThesisProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Investment Thesis
      </h3>

      {/* Executive Summary */}
      <div className="mb-6 rounded-xl bg-indigo-50/50 p-4 dark:bg-indigo-950/20">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {data.executiveSummary}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Bull Case */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 dark:border-emerald-800/30 dark:bg-emerald-950/10">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Bull Case
            </h4>
          </div>
          <ul className="space-y-2">
            {data.investmentThesis.bullCase.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="mt-1 text-emerald-500">▲</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Bear Case */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-4 dark:border-rose-800/30 dark:bg-rose-950/10">
          <div className="mb-3 flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-rose-500" />
            <h4 className="text-sm font-semibold text-rose-700 dark:text-rose-400">
              Bear Case
            </h4>
          </div>
          <ul className="space-y-2">
            {data.investmentThesis.bearCase.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="mt-1 text-rose-500">▼</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Committee Opinions */}
      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
          Committee Member Opinions
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {data.committeeOpinions.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {member.name}
                  </p>
                  <p className="text-xs text-slate-400">{member.role}</p>
                </div>
                <span
                  className={`text-xs font-bold ${
                    member.recommendation.includes("INVEST")
                      ? "text-emerald-500"
                      : member.recommendation === "HOLD"
                        ? "text-amber-500"
                        : "text-rose-500"
                  }`}
                >
                  {member.recommendation}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {member.reasoning}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

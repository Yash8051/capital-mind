// ============================================================
// CapitalMind AI — AI Reasoning (Explainable AI)
// ============================================================

"use client";

import { motion } from "motion/react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { InvestmentDecision } from "@/types";

interface AIReasoningProps {
  data: InvestmentDecision;
}

export function AIReasoning({ data }: AIReasoningProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Why did AI recommend this?
      </h3>
      <p className="mb-4 text-xs text-slate-400">Explainable AI Factors</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Positive Factors */}
        <div className="rounded-xl bg-emerald-50/50 p-4 dark:bg-emerald-950/20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Supporting Factors
          </p>
          <ul className="space-y-2">
            {data.explainableFactors.positive.map((factor, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                {factor}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Negative Factors */}
        <div className="rounded-xl bg-rose-50/50 p-4 dark:bg-rose-950/20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Risk Factors
          </p>
          <ul className="space-y-2">
            {data.explainableFactors.negative.map((factor, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
              >
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                {factor}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detailed Reasoning */}
      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
          Detailed Analysis
        </p>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line">
          {data.detailedReasoning}
        </p>
      </div>
    </motion.div>
  );
}

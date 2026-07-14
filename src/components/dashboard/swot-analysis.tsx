// ============================================================
// CapitalMind AI — SWOT Analysis
// ============================================================

"use client";

import { motion } from "motion/react";
import type { SWOTAnalysis as SWOTType } from "@/types";

interface SWOTAnalysisProps {
  data: SWOTType;
}

const quadrants = [
  { key: "strengths" as const, label: "Strengths", color: "from-emerald-500/10 to-emerald-600/5", border: "border-emerald-200 dark:border-emerald-800/30", textColor: "text-emerald-700 dark:text-emerald-400", icon: "💪" },
  { key: "weaknesses" as const, label: "Weaknesses", color: "from-rose-500/10 to-rose-600/5", border: "border-rose-200 dark:border-rose-800/30", textColor: "text-rose-700 dark:text-rose-400", icon: "⚠️" },
  { key: "opportunities" as const, label: "Opportunities", color: "from-blue-500/10 to-blue-600/5", border: "border-blue-200 dark:border-blue-800/30", textColor: "text-blue-700 dark:text-blue-400", icon: "🚀" },
  { key: "threats" as const, label: "Threats", color: "from-amber-500/10 to-amber-600/5", border: "border-amber-200 dark:border-amber-800/30", textColor: "text-amber-700 dark:text-amber-400", icon: "⚡" },
];

export function SWOTAnalysis({ data }: SWOTAnalysisProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        SWOT Analysis
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {quadrants.map((q, i) => (
          <motion.div
            key={q.key}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-xl border bg-gradient-to-br p-4 ${q.color} ${q.border}`}
          >
            <div className="mb-3 flex items-center gap-2">
              <span>{q.icon}</span>
              <h4 className={`text-sm font-semibold ${q.textColor}`}>{q.label}</h4>
            </div>
            <ul className="space-y-1.5">
              {data[q.key].map((item, j) => (
                <li key={j} className="text-sm text-slate-600 dark:text-slate-400">
                  • {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

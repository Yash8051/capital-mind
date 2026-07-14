// ============================================================
// CapitalMind AI — Competitor Table
// ============================================================

"use client";

import { motion } from "motion/react";
import { formatLargeNumber, formatPercentage } from "@/lib/utils";
import { CompetitorBarChart } from "@/components/charts/competitor-bar";
import type { CompetitorAnalysisResult } from "@/types";

interface CompetitorTableProps {
  data: CompetitorAnalysisResult;
}

export function CompetitorTable({ data }: CompetitorTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Competitor Analysis
      </h3>

      {/* Chart */}
      <div className="mb-6">
        <CompetitorBarChart competitors={data.competitors} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Company</th>
              <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Market Cap</th>
              <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Revenue</th>
              <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">Growth</th>
              <th className="pb-3 font-medium text-slate-500 dark:text-slate-400">P/E</th>
            </tr>
          </thead>
          <tbody>
            {data.competitors.map((comp, i) => (
              <motion.tr
                key={comp.ticker}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-slate-100 dark:border-slate-800"
              >
                <td className="py-3">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{comp.name}</p>
                    <p className="text-xs text-slate-400">{comp.ticker}</p>
                  </div>
                </td>
                <td className="py-3 text-slate-700 dark:text-slate-300">
                  {comp.marketCapFormatted || formatLargeNumber(comp.marketCap)}
                </td>
                <td className="py-3 text-slate-700 dark:text-slate-300">
                  {comp.revenueFormatted || formatLargeNumber(comp.revenue)}
                </td>
                <td className={`py-3 font-medium ${comp.revenueGrowth >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  {formatPercentage(comp.revenueGrowth)}
                </td>
                <td className="py-3 text-slate-700 dark:text-slate-300">
                  {comp.peRatio?.toFixed(1) || "N/A"}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {data.summary}
      </p>
    </motion.div>
  );
}

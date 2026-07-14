// ============================================================
// CapitalMind AI — Financial Metrics Display
// ============================================================

"use client";

import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatLargeNumber, formatPercentage } from "@/lib/utils";
import type { FinancialAnalysisResult } from "@/types";

interface FinancialMetricsProps {
  data: FinancialAnalysisResult;
}

export function FinancialMetrics({ data }: FinancialMetricsProps) {
  const metricEntries = Object.entries(data.metrics);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Financial Metrics
      </h3>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {metricEntries.map(([key, metric], i) => {
          const TrendIcon =
            metric.trend === "up"
              ? TrendingUp
              : metric.trend === "down"
                ? TrendingDown
                : Minus;
          const trendColor =
            metric.trend === "up"
              ? "text-emerald-500"
              : metric.trend === "down"
                ? "text-rose-500"
                : "text-slate-400";

          const displayValue =
            typeof metric.value === "number"
              ? key.includes("Growth") || key.includes("Margin") || key === "roe" || key === "roa" || key === "dividendYield"
                ? formatPercentage(metric.value)
                : key.includes("Ratio") || key === "peRatio" || key === "eps"
                  ? metric.value.toFixed(2)
                  : formatLargeNumber(metric.value)
              : metric.value;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {metric.label}
                </p>
                <TrendIcon className={`h-3.5 w-3.5 ${trendColor}`} />
              </div>
              <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                {displayValue}
              </p>
              {metric.change !== undefined && metric.change !== 0 && (
                <p className={`mt-0.5 text-xs ${trendColor}`}>
                  {formatPercentage(metric.change)} YoY
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Strengths & Concerns */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">
            Strengths
          </p>
          <ul className="space-y-1">
            {data.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="mt-1 text-emerald-500">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-rose-600 dark:text-rose-400">
            Concerns
          </p>
          <ul className="space-y-1">
            {data.concerns.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="mt-1 text-rose-500">✗</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

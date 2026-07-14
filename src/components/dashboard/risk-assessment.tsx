// ============================================================
// CapitalMind AI — Risk Assessment Display
// ============================================================

"use client";

import { motion } from "motion/react";
import { getRiskColor } from "@/lib/utils";
import { RiskRadarChart } from "@/components/charts/risk-radar";
import type { RiskAssessmentResult } from "@/types";

interface RiskAssessmentProps {
  data: RiskAssessmentResult;
}

export function RiskAssessment({ data }: RiskAssessmentProps) {
  const factors = Object.entries(data.factors);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Risk Assessment
        </h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getRiskColor(data.overallRiskLevel)} ${
            data.overallRiskLevel === "low"
              ? "bg-emerald-100 dark:bg-emerald-900/30"
              : data.overallRiskLevel === "high" || data.overallRiskLevel === "critical"
                ? "bg-rose-100 dark:bg-rose-900/30"
                : "bg-amber-100 dark:bg-amber-900/30"
          }`}
        >
          {data.overallRiskLevel} Risk
        </span>
      </div>

      {/* Radar Chart */}
      <div className="mt-4 flex justify-center">
        <RiskRadarChart factors={data.factors} />
      </div>

      {/* Risk Breakdown */}
      <div className="mt-6 space-y-3">
        {factors.map(([, factor], i) => (
          <motion.div
            key={factor.category}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {factor.category}
              </span>
              <span className={`text-xs font-semibold capitalize ${getRiskColor(factor.level)}`}>
                {factor.level}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
              {factor.description}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${factor.score}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={`h-full rounded-full ${
                  factor.score >= 70
                    ? "bg-rose-500"
                    : factor.score >= 40
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Key Risks */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase text-rose-600 dark:text-rose-400">
          Key Risks
        </p>
        <ul className="space-y-1">
          {data.keyRisks.map((risk, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="mt-0.5 text-rose-500">⚠</span>
              {risk}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

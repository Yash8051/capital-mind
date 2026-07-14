// ============================================================
// CapitalMind AI — Score Card + Recommendation Card
// ============================================================

"use client";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect } from "react";
import { getScoreColor, getRecommendationColor, getRecommendationGradient } from "@/lib/utils";
import type { Recommendation } from "@/types";

// ── Animated Counter ─────────────────────────────────────────

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.5,
      ease: "easeOut",
    });
    return controls.stop;
  }, [motionValue, value]);

  return (
    <span className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

// ── Score Card ───────────────────────────────────────────────

interface ScoreCardProps {
  label: string;
  score: number;
  maxScore?: number;
  icon?: React.ReactNode;
}

export function ScoreCard({ label, score, maxScore = 100, icon }: ScoreCardProps) {
  const percentage = (score / maxScore) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </p>
        {icon}
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
          <AnimatedNumber value={score} />
        </span>
        <span className="text-sm text-slate-400">/ {maxScore}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className={`h-full rounded-full ${
            score >= 80
              ? "bg-emerald-500"
              : score >= 60
                ? "bg-amber-500"
                : score >= 40
                  ? "bg-orange-500"
                  : "bg-rose-500"
          }`}
        />
      </div>
    </motion.div>
  );
}

// ── Recommendation Card ──────────────────────────────────────

interface RecommendationCardProps {
  recommendation: Recommendation;
  investmentScore: number;
  confidenceScore: number;
  riskLevel: string;
}

export function RecommendationCard({
  recommendation,
  investmentScore,
  confidenceScore,
  riskLevel,
}: RecommendationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", bounce: 0.3 }}
      className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br ${getRecommendationGradient(recommendation)} p-6 dark:border-slate-800`}
    >
      {/* Background pulse */}
      <div className="absolute inset-0 -z-10 animate-pulse opacity-30">
        <div className={`h-full w-full bg-gradient-to-br ${getRecommendationGradient(recommendation)}`} />
      </div>

      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Final Recommendation
      </p>

      <motion.p
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
        className={`mt-3 text-3xl font-extrabold tracking-tight ${getRecommendationColor(recommendation)}`}
      >
        {recommendation}
      </motion.p>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Score</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            <AnimatedNumber value={investmentScore} />
            <span className="text-sm font-normal text-slate-400">/100</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Confidence</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            <AnimatedNumber value={confidenceScore} suffix="%" />
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Risk</p>
          <p className={`text-lg font-bold capitalize ${
            riskLevel === "low" ? "text-emerald-500" :
            riskLevel === "medium" ? "text-amber-500" : "text-rose-500"
          }`}>
            {riskLevel}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency (e.g., $1,234,567.89)
 */
export function formatCurrency(value: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format large numbers with abbreviations (e.g., 1.5B, 234M, 12K)
 */
export function formatLargeNumber(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1e12) return `${sign}$${(absValue / 1e12).toFixed(2)}T`;
  if (absValue >= 1e9) return `${sign}$${(absValue / 1e9).toFixed(2)}B`;
  if (absValue >= 1e6) return `${sign}$${(absValue / 1e6).toFixed(2)}M`;
  if (absValue >= 1e3) return `${sign}$${(absValue / 1e3).toFixed(1)}K`;
  return `${sign}$${absValue.toFixed(2)}`;
}

/**
 * Format a number as a percentage (e.g., 12.34%)
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Get score color based on value (0–100)
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  if (score >= 40) return "text-orange-500";
  return "text-rose-500";
}

/**
 * Get score background color based on value (0–100)
 */
export function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-emerald-500/10";
  if (score >= 60) return "bg-amber-500/10";
  if (score >= 40) return "bg-orange-500/10";
  return "bg-rose-500/10";
}

/**
 * Get recommendation color
 */
export function getRecommendationColor(rec: string): string {
  switch (rec) {
    case "STRONG INVEST":
      return "text-emerald-400";
    case "INVEST":
      return "text-emerald-500";
    case "HOLD":
      return "text-amber-500";
    case "PASS":
      return "text-rose-500";
    default:
      return "text-slate-400";
  }
}

/**
 * Get recommendation background gradient
 */
export function getRecommendationGradient(rec: string): string {
  switch (rec) {
    case "STRONG INVEST":
      return "from-emerald-500/20 to-emerald-600/10";
    case "INVEST":
      return "from-emerald-500/15 to-green-600/10";
    case "HOLD":
      return "from-amber-500/15 to-yellow-600/10";
    case "PASS":
      return "from-rose-500/15 to-red-600/10";
    default:
      return "from-slate-500/15 to-slate-600/10";
  }
}

/**
 * Get risk level color
 */
export function getRiskColor(level: string): string {
  switch (level) {
    case "low":
      return "text-emerald-500";
    case "medium":
      return "text-amber-500";
    case "high":
      return "text-orange-500";
    case "critical":
      return "text-rose-500";
    default:
      return "text-slate-400";
  }
}

/**
 * Get sentiment color
 */
export function getSentimentColor(sentiment: string): string {
  switch (sentiment) {
    case "positive":
      return "text-emerald-500";
    case "neutral":
      return "text-slate-400";
    case "negative":
      return "text-rose-500";
    default:
      return "text-slate-400";
  }
}

/**
 * Agent display names
 */
export const AGENT_DISPLAY_NAMES: Record<string, string> = {
  supervisor: "Supervisor Agent",
  "company-research": "Company Research Agent",
  "financial-analyst": "Financial Analyst Agent",
  "news-sentiment": "News Sentiment Agent",
  "competitor-analysis": "Competitor Analysis Agent",
  "risk-assessment": "Risk Assessment Agent",
  "investment-committee": "Investment Committee",
};

/**
 * Agent icons (Lucide icon names)
 */
export const AGENT_ICONS: Record<string, string> = {
  supervisor: "Brain",
  "company-research": "Building2",
  "financial-analyst": "TrendingUp",
  "news-sentiment": "Newspaper",
  "competitor-analysis": "Users",
  "risk-assessment": "ShieldAlert",
  "investment-committee": "Gavel",
};

/**
 * Delay utility for animations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

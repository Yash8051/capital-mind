// ============================================================
// CapitalMind AI — Agent Progress View
// ============================================================

"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Building2,
  TrendingUp,
  Newspaper,
  Users,
  ShieldAlert,
  Gavel,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { AgentProgress as AgentProgressType, AgentName } from "@/types";

const agentConfig: Record<
  AgentName,
  { icon: React.ElementType; label: string; color: string }
> = {
  supervisor: { icon: Brain, label: "Supervisor Agent", color: "text-indigo-500" },
  "company-research": { icon: Building2, label: "Company Research", color: "text-blue-500" },
  "financial-analyst": { icon: TrendingUp, label: "Financial Analyst", color: "text-emerald-500" },
  "news-sentiment": { icon: Newspaper, label: "News Sentiment", color: "text-amber-500" },
  "competitor-analysis": { icon: Users, label: "Competitor Analysis", color: "text-rose-500" },
  "risk-assessment": { icon: ShieldAlert, label: "Risk Assessment", color: "text-cyan-500" },
  "investment-committee": { icon: Gavel, label: "Investment Committee", color: "text-purple-500" },
};

const allAgents: AgentName[] = [
  "supervisor",
  "company-research",
  "financial-analyst",
  "news-sentiment",
  "competitor-analysis",
  "risk-assessment",
  "investment-committee",
];

interface AgentProgressProps {
  progress: AgentProgressType[];
}

export function AgentProgress({ progress }: AgentProgressProps) {
  const getAgentStatus = (agent: AgentName) => {
    const agentProgress = progress.filter((p) => p.agent === agent);
    if (agentProgress.length === 0) return "pending";
    const latest = agentProgress[agentProgress.length - 1];
    return latest.status;
  };

  const getAgentMessage = (agent: AgentName) => {
    const agentProgress = progress.filter((p) => p.agent === agent);
    if (agentProgress.length === 0) return "Waiting...";
    return agentProgress[agentProgress.length - 1].message;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Agent Pipeline
      </h3>
      <div className="space-y-3">
        <AnimatePresence>
          {allAgents.map((agent, i) => {
            const config = agentConfig[agent];
            const status = getAgentStatus(agent);
            const message = getAgentMessage(agent);
            const Icon = config.icon;

            return (
              <motion.div
                key={agent}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3"
              >
                {/* Status Icon */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                  {status === "complete" ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : status === "running" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                  ) : status === "error" ? (
                    <AlertCircle className="h-4 w-4 text-rose-500" />
                  ) : (
                    <Icon className={`h-4 w-4 text-slate-400`} />
                  )}
                </div>

                {/* Agent Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        status === "running"
                          ? config.color
                          : status === "complete"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {config.label}
                    </span>
                  </div>
                  <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                    {message}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="hidden w-20 sm:block">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{
                        width:
                          status === "complete"
                            ? "100%"
                            : status === "running"
                              ? "60%"
                              : "0%",
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        status === "complete"
                          ? "bg-emerald-500"
                          : status === "running"
                            ? "bg-indigo-500"
                            : status === "error"
                              ? "bg-rose-500"
                              : "bg-slate-300"
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================
// CapitalMind AI — Dashboard Page (InvestIQ Theme)
// ============================================================

"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Sidebar } from "@/components/shared/sidebar";
import { Topbar } from "@/components/shared/topbar";
import { useAnalysis } from "@/hooks/use-analysis";
import { DollarSign, TrendingUp, Shield, Activity } from "lucide-react";
import { 
  TopMetricCard, 
  CompanyOverview, 
  FinancialOverview, 
  AIConfidence, 
  QuickInsights, 
  MarketStatus 
} from "@/components/dashboard/investiq-cards";
import { AgentProgress } from "@/components/dashboard/agent-progress";

function DashboardContent() {
  const searchParams = useSearchParams();
  const { state, analyze } = useAnalysis();

  // Auto-analyze if company is in URL params
  useEffect(() => {
    const company = searchParams.get("company");
    if (company && state.status === "idle") {
      analyze(company);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const isAnalyzing = state.status === "analyzing";
  const isComplete = state.status === "complete";
  const hasError = state.status === "error";

  // Financial values
  const currentPrice = state.rawQuote?.realTime?.price || state.rawQuote?.price || 0;
  const changePercent = state.rawQuote?.realTime?.changePercent || state.rawQuote?.changePercent || 0;
  const dayHigh = state.rawQuote?.realTime?.high52Week || state.rawQuote?.high52Week || 0;
  const dayLow = state.rawQuote?.realTime?.low52Week || state.rawQuote?.low52Week || 0;
  const dayOpen = state.rawQuote?.realTime?.open || 0;

  return (
    <div className="flex h-screen bg-[#0b1120] text-slate-300 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            
            {/* Analyzing State Overlay */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6"
                >
                  <AgentProgress progress={state.progress} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error State */}
            {hasError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-rose-800/30 bg-rose-950/20 p-6 text-center"
              >
                <p className="text-rose-400">{state.error}</p>
              </motion.div>
            )}

            {/* Top Row: Metrics */}
            <div className="grid grid-cols-4 gap-6">
              <TopMetricCard 
                title="CURRENT PRICE" 
                value={`$${currentPrice.toFixed(2)}`} 
                subtext="Live Market Price"
                icon={DollarSign}
                colorClass="text-green-500 bg-green-500/20"
                valueColorClass="text-green-500"
              />
              <TopMetricCard 
                title="DAILY CHANGE" 
                value={`${changePercent.toFixed(2)}%`} 
                subtext="Today's Change"
                icon={TrendingUp}
                colorClass="text-green-500 bg-green-500/20"
                valueColorClass="text-green-500"
              />
              <TopMetricCard 
                title="INVESTMENT SCORE" 
                value={`${state.investmentDecision?.investmentScore || 0}/100`} 
                subtext="AI Score"
                icon={Activity}
                colorClass="text-blue-500 bg-blue-500/20"
                valueColorClass="text-blue-500"
              />
              <TopMetricCard 
                title="RISK" 
                value={state.investmentDecision?.riskLevel || "Low"} 
                subtext="Risk Level"
                icon={Shield}
                colorClass="text-green-500 bg-green-500/20"
                valueColorClass="text-green-500"
              />
            </div>

            {/* Middle Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 h-full">
                <CompanyOverview data={state.rawQuote || state.companyResearch?.overview} />
              </div>
              <div className="lg:col-span-1 h-full">
                <FinancialOverview 
                  current={currentPrice.toFixed(2)}
                  high={dayHigh.toFixed(2)}
                  low={dayLow.toFixed(2)}
                  open={dayOpen.toFixed(2)}
                />
              </div>
              <div className="lg:col-span-1 h-full">
                <AIConfidence 
                  score={state.investmentDecision?.confidenceScore || 0}
                  recommendation={state.investmentDecision?.recommendation || "Hold"}
                />
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <QuickInsights />
              <div className="lg:col-span-1">
                <MarketStatus />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#0b1120]"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}

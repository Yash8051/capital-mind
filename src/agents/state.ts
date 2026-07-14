// ============================================================
// CapitalMind AI — LangGraph Shared State Schema
// ============================================================

import { Annotation } from "@langchain/langgraph";
import type {
  CompanyResearchResult,
  FinancialAnalysisResult,
  NewsSentimentResult,
  CompetitorAnalysisResult,
  RiskAssessmentResult,
  InvestmentDecision,
  AgentProgress,
} from "@/types";

/**
 * Shared state for the CapitalMind AI LangGraph workflow.
 *
 * Uses Annotation.Root with reducers for fields that are updated
 * by parallel agents (agentProgress, errors).
 */
export const CapitalMindState = Annotation.Root({
  // ── Input ─────────────────────────────────────────────
  companyName: Annotation<string>({
    reducer: (_prev, next) => next,
  }),
  ticker: Annotation<string>({
    reducer: (_prev, next) => next,
  }),
  exchange: Annotation<string>({
    reducer: (_prev, next) => next,
  }),

  // ── Raw Data Context (from APIs, passed to agents) ────
  financialDataContext: Annotation<string>({
    reducer: (_prev, next) => next,
  }),
  newsDataContext: Annotation<string>({
    reducer: (_prev, next) => next,
  }),

  // ── Agent Outputs ─────────────────────────────────────
  companyResearch: Annotation<CompanyResearchResult | null>({
    reducer: (_prev, next) => next,
  }),
  financialAnalysis: Annotation<FinancialAnalysisResult | null>({
    reducer: (_prev, next) => next,
  }),
  newsSentiment: Annotation<NewsSentimentResult | null>({
    reducer: (_prev, next) => next,
  }),
  competitorAnalysis: Annotation<CompetitorAnalysisResult | null>({
    reducer: (_prev, next) => next,
  }),
  riskAssessment: Annotation<RiskAssessmentResult | null>({
    reducer: (_prev, next) => next,
  }),
  investmentDecision: Annotation<InvestmentDecision | null>({
    reducer: (_prev, next) => next,
  }),

  // ── Progress (accumulated from all agents) ────────────
  agentProgress: Annotation<AgentProgress[]>({
    reducer: (prev, next) => [...prev, ...next],
  }),

  // ── Errors (accumulated) ──────────────────────────────
  errors: Annotation<string[]>({
    reducer: (prev, next) => [...prev, ...next],
  }),
});

export type CapitalMindStateType = typeof CapitalMindState.State;

// ============================================================
// CapitalMind AI — Competitor Analysis Agent
// ============================================================

import type { CapitalMindStateType } from "./state";
import { invokeGeminiJSON } from "@/services/gemini";
import { COMPETITOR_ANALYSIS_PROMPT } from "@/lib/prompts";
import type { CompetitorAnalysisResult } from "@/types";

/**
 * Competitor Analysis Agent
 *
 * Identifies top competitors, compares market share, revenue,
 * growth, and determines competitive positioning.
 */
export async function competitorAnalysisAgent(
  state: CapitalMindStateType
): Promise<Partial<CapitalMindStateType>> {
  const progress = [
    {
      agent: "competitor-analysis" as const,
      status: "running" as const,
      message: `Analyzing competitors of ${state.companyName}...`,
      timestamp: Date.now(),
    },
  ];

  try {
    const userMessage = `
Analyze competitors for:
Company: ${state.companyName}
Ticker: ${state.ticker}

Financial context:
${state.financialDataContext || "No external data available."}

Identify the top 4-6 competitors and provide a comprehensive competitive analysis.
Include specific financial metrics for each competitor.
`;

    const result = await invokeGeminiJSON<CompetitorAnalysisResult>(
      COMPETITOR_ANALYSIS_PROMPT,
      userMessage
    );

    return {
      competitorAnalysis: result,
      agentProgress: [
        ...progress,
        {
          agent: "competitor-analysis" as const,
          status: "complete" as const,
          message: `Competitor analysis complete. Advantage score: ${result.competitiveAdvantageScore}/100`,
          timestamp: Date.now(),
        },
      ],
      errors: [],
    };
  } catch (error) {
    return {
      agentProgress: [
        ...progress,
        {
          agent: "competitor-analysis" as const,
          status: "error" as const,
          message: `Error: ${error instanceof Error ? error.message : "Unknown"}`,
          timestamp: Date.now(),
        },
      ],
      errors: [`Competitor Analysis: ${error instanceof Error ? error.message : "Unknown"}`],
    };
  }
}

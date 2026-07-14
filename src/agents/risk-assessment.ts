// ============================================================
// CapitalMind AI — Risk Assessment Agent
// ============================================================

import type { CapitalMindStateType } from "./state";
import { invokeGeminiJSON } from "@/services/gemini";
import { RISK_ASSESSMENT_PROMPT } from "@/lib/prompts";
import type { RiskAssessmentResult } from "@/types";

/**
 * Risk Assessment Agent
 *
 * Evaluates market, financial, industry, regulatory, valuation,
 * and competition risks with mitigation factors.
 */
export async function riskAssessmentAgent(
  state: CapitalMindStateType
): Promise<Partial<CapitalMindStateType>> {
  const progress = [
    {
      agent: "risk-assessment" as const,
      status: "running" as const,
      message: `Assessing risks for ${state.companyName}...`,
      timestamp: Date.now(),
    },
  ];

  try {
    const userMessage = `
Assess investment risks for:
Company: ${state.companyName}
Ticker: ${state.ticker}

Financial context:
${state.financialDataContext || "No external financial data available."}

News context:
${state.newsDataContext || "No recent news data available."}

Evaluate all six risk categories thoroughly with specific evidence.
`;

    const result = await invokeGeminiJSON<RiskAssessmentResult>(
      RISK_ASSESSMENT_PROMPT,
      userMessage
    );

    return {
      riskAssessment: result,
      agentProgress: [
        ...progress,
        {
          agent: "risk-assessment" as const,
          status: "complete" as const,
          message: `Risk assessment complete. Overall risk: ${result.overallRiskLevel} (${result.overallRiskScore}/100)`,
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
          agent: "risk-assessment" as const,
          status: "error" as const,
          message: `Error: ${error instanceof Error ? error.message : "Unknown"}`,
          timestamp: Date.now(),
        },
      ],
      errors: [`Risk Assessment: ${error instanceof Error ? error.message : "Unknown"}`],
    };
  }
}

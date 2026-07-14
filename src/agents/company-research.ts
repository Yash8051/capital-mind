// ============================================================
// CapitalMind AI — Company Research Agent
// ============================================================

import type { CapitalMindStateType } from "./state";
import { invokeGeminiJSON } from "@/services/gemini";
import { COMPANY_RESEARCH_PROMPT } from "@/lib/prompts";
import type { CompanyResearchResult } from "@/types";

/**
 * Company Research Agent
 *
 * Analyzes company fundamentals, business model, competitive advantages,
 * growth opportunities, and assigns a company quality score.
 */
export async function companyResearchAgent(
  state: CapitalMindStateType
): Promise<Partial<CapitalMindStateType>> {
  const progress = [
    {
      agent: "company-research" as const,
      status: "running" as const,
      message: `Researching ${state.companyName}...`,
      timestamp: Date.now(),
    },
  ];

  try {
    const userMessage = `
Analyze the following company:
Company: ${state.companyName}
Ticker: ${state.ticker}
Exchange: ${state.exchange}

Additional financial data context:
${state.financialDataContext || "No external financial data available — use your knowledge."}

Provide comprehensive company research with a score out of 100.
`;

    const result = await invokeGeminiJSON<CompanyResearchResult>(
      COMPANY_RESEARCH_PROMPT,
      userMessage
    );

    return {
      companyResearch: result,
      agentProgress: [
        ...progress,
        {
          agent: "company-research" as const,
          status: "complete" as const,
          message: `Company research complete. Score: ${result.score}/100`,
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
          agent: "company-research" as const,
          status: "error" as const,
          message: `Error: ${error instanceof Error ? error.message : "Unknown"}`,
          timestamp: Date.now(),
        },
      ],
      errors: [`Company Research: ${error instanceof Error ? error.message : "Unknown"}`],
    };
  }
}

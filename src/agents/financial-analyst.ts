// ============================================================
// CapitalMind AI — Financial Analyst Agent
// ============================================================

import type { CapitalMindStateType } from "./state";
import { invokeGeminiJSON } from "@/services/gemini";
import { FINANCIAL_ANALYST_PROMPT } from "@/lib/prompts";
import type { FinancialAnalysisResult } from "@/types";

/**
 * Financial Analyst Agent
 *
 * Performs deep financial analysis including revenue growth, profitability,
 * valuation metrics, and historical performance.
 */
export async function financialAnalystAgent(
  state: CapitalMindStateType
): Promise<Partial<CapitalMindStateType>> {
  const progress = [
    {
      agent: "financial-analyst" as const,
      status: "running" as const,
      message: `Analyzing financials for ${state.ticker}...`,
      timestamp: Date.now(),
    },
  ];

  try {
    const userMessage = `
Analyze the financials for:
Company: ${state.companyName}
Ticker: ${state.ticker}

Financial data from APIs:
${state.financialDataContext || "No external financial data available — use your knowledge of this company's publicly reported financials."}

Provide comprehensive financial analysis with a score out of 100.
Include historical revenue and profit data points (at least 4-5 years).
Include recent stock price history (monthly for the past year).
`;

    const result = await invokeGeminiJSON<FinancialAnalysisResult>(
      FINANCIAL_ANALYST_PROMPT,
      userMessage
    );

    return {
      financialAnalysis: result,
      agentProgress: [
        ...progress,
        {
          agent: "financial-analyst" as const,
          status: "complete" as const,
          message: `Financial analysis complete. Score: ${result.score}/100`,
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
          agent: "financial-analyst" as const,
          status: "error" as const,
          message: `Error: ${error instanceof Error ? error.message : "Unknown"}`,
          timestamp: Date.now(),
        },
      ],
      errors: [`Financial Analyst: ${error instanceof Error ? error.message : "Unknown"}`],
    };
  }
}

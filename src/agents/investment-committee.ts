// ============================================================
// CapitalMind AI — Investment Committee Agent
// ============================================================

import type { CapitalMindStateType } from "./state";
import { invokeGeminiJSON } from "@/services/gemini";
import { INVESTMENT_COMMITTEE_PROMPT } from "@/lib/prompts";
import type { InvestmentDecision } from "@/types";

/**
 * Investment Committee Agent
 *
 * Acts as a panel of 4 legendary investors (Buffett, Lynch, Dalio, Wood)
 * who evaluate all agent outputs and produce a final investment recommendation.
 */
export async function investmentCommitteeAgent(
  state: CapitalMindStateType
): Promise<Partial<CapitalMindStateType>> {
  const progress = [
    {
      agent: "investment-committee" as const,
      status: "running" as const,
      message: "Investment committee deliberating...",
      timestamp: Date.now(),
    },
  ];

  try {
    // Compile all agent findings into a comprehensive brief
    const brief = `
# Investment Brief: ${state.companyName} (${state.ticker})

## 1. Company Research
${state.companyResearch ? JSON.stringify(state.companyResearch, null, 2) : "UNAVAILABLE — Company research agent failed."}

## 2. Financial Analysis
${state.financialAnalysis ? JSON.stringify(state.financialAnalysis, null, 2) : "UNAVAILABLE — Financial analysis agent failed."}

## 3. News Sentiment
${state.newsSentiment ? JSON.stringify(state.newsSentiment, null, 2) : "UNAVAILABLE — News sentiment agent failed."}

## 4. Competitor Analysis
${state.competitorAnalysis ? JSON.stringify(state.competitorAnalysis, null, 2) : "UNAVAILABLE — Competitor analysis agent failed."}

## 5. Risk Assessment
${state.riskAssessment ? JSON.stringify(state.riskAssessment, null, 2) : "UNAVAILABLE — Risk assessment agent failed."}

## Agent Scores Summary
- Company Score: ${state.companyResearch?.score ?? "N/A"}/100
- Financial Score: ${state.financialAnalysis?.score ?? "N/A"}/100
- Sentiment Score: ${state.newsSentiment?.sentimentScore ?? "N/A"}/100
- Competitive Advantage Score: ${state.competitorAnalysis?.competitiveAdvantageScore ?? "N/A"}/100
- Risk Score: ${state.riskAssessment?.overallRiskScore ?? "N/A"}/100 (lower is better)
`;

    const userMessage = `
Review this complete investment brief and provide the Investment Committee's final recommendation.

${brief}

Each committee member (Buffett, Lynch, Dalio, Wood) must independently evaluate and provide their recommendation.
Then synthesize into a final committee decision with investment score, confidence score, SWOT analysis, and explainable factors.
`;

    const result = await invokeGeminiJSON<InvestmentDecision>(
      INVESTMENT_COMMITTEE_PROMPT,
      userMessage
    );

    return {
      investmentDecision: result,
      agentProgress: [
        ...progress,
        {
          agent: "investment-committee" as const,
          status: "complete" as const,
          message: `Committee decision: ${result.recommendation} (Score: ${result.investmentScore}/100, Confidence: ${result.confidenceScore}%)`,
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
          agent: "investment-committee" as const,
          status: "error" as const,
          message: `Error: ${error instanceof Error ? error.message : "Unknown"}`,
          timestamp: Date.now(),
        },
      ],
      errors: [`Investment Committee: ${error instanceof Error ? error.message : "Unknown"}`],
    };
  }
}

// ============================================================
// CapitalMind AI — Supervisor Agent
// ============================================================

import type { CapitalMindStateType } from "./state";
import { lookupCompany } from "@/services/company-lookup";
import { getAllFinancialData } from "@/services/financial-data";
import { fetchCompanyNews } from "@/services/news";

/**
 * Supervisor Agent
 *
 * Responsibilities:
 * 1. Resolve company name to ticker symbol
 * 2. Fetch raw data from external APIs
 * 3. Prepare context for downstream agents
 */
export async function supervisorAgent(
  state: CapitalMindStateType
): Promise<Partial<CapitalMindStateType>> {
  const progress = [
    {
      agent: "supervisor" as const,
      status: "running" as const,
      message: `Resolving company: ${state.companyName}...`,
      timestamp: Date.now(),
    },
  ];

  try {
    // 1. Resolve company name to ticker
    const lookup = await lookupCompany(state.companyName);

    const ticker = lookup?.ticker || state.companyName.toUpperCase();
    const companyName = lookup?.name || state.companyName;
    const exchange = lookup?.exchange || "Unknown";

    // 2. Fetch external data in parallel
    const [financialData, newsArticles] = await Promise.all([
      getAllFinancialData(ticker, companyName, exchange),
      fetchCompanyNews(companyName, ticker),
    ]);

    if (!financialData.quote) {
      throw new Error(`Could not fetch financial data for ${ticker}. Please verify the symbol or API limits.`);
    }

    // 3. Serialize context for agents
    const financialDataContext = JSON.stringify(
      {
        quote: financialData.quote,
        financials: financialData.financials,
        historicalPrices: financialData.history,
      },
      null,
      2
    );

    const newsDataContext = JSON.stringify(
      newsArticles.map((a) => ({
        title: a.title,
        source: a.source.name,
        url: a.url,
        publishedAt: a.publishedAt,
        description: a.description,
      })),
      null,
      2
    );

    return {
      companyName,
      ticker,
      exchange,
      financialDataContext,
      newsDataContext,
      agentProgress: [
        ...progress,
        {
          agent: "supervisor" as const,
          status: "complete" as const,
          message: `Resolved: ${companyName} (${ticker}) on ${exchange}`,
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
          agent: "supervisor" as const,
          status: "error" as const,
          message: `Supervisor error: ${error instanceof Error ? error.message : "Unknown error"}`,
          timestamp: Date.now(),
        },
      ],
      errors: [`Supervisor: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }
}

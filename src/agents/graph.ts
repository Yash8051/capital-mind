// ============================================================
// CapitalMind AI — LangGraph Workflow Definition
// ============================================================

import { StateGraph } from "@langchain/langgraph";
import { CapitalMindState } from "./state";
import { supervisorAgent } from "./supervisor";
import { companyResearchAgent } from "./company-research";
import { financialAnalystAgent } from "./financial-analyst";
import { newsSentimentAgent } from "./news-sentiment";
import { competitorAnalysisAgent } from "./competitor-analysis";
import { riskAssessmentAgent } from "./risk-assessment";
import { investmentCommitteeAgent } from "./investment-committee";

/**
 * Build and compile the CapitalMind AI multi-agent workflow.
 *
 * Flow:
 *   __start__ → supervisor → [company, financial, news, competitor, risk] (parallel) → committee → __end__
 *
 * The supervisor runs first to resolve the company and fetch external data.
 * Then 5 analysis agents run in parallel (same LangGraph super-step).
 * Finally, the investment committee evaluates all outputs.
 */
export function buildCapitalMindGraph() {
  const workflow = new StateGraph(CapitalMindState)
    // ── Add nodes ─────────────────────────────────────────
    .addNode("supervisor", supervisorAgent)
    .addNode("company_research", companyResearchAgent)
    .addNode("financial_analyst", financialAnalystAgent)
    .addNode("news_sentiment", newsSentimentAgent)
    .addNode("competitor_analysis", competitorAnalysisAgent)
    .addNode("risk_assessment", riskAssessmentAgent)
    .addNode("investment_committee", investmentCommitteeAgent)

    // ── Edges: Start → Supervisor ─────────────────────────
    .addEdge("__start__", "supervisor")

    // ── Fan-out: Supervisor → 5 Parallel Agents ───────────
    .addEdge("supervisor", "company_research")
    .addEdge("supervisor", "financial_analyst")
    .addEdge("supervisor", "news_sentiment")
    .addEdge("supervisor", "competitor_analysis")
    .addEdge("supervisor", "risk_assessment")

    // ── Fan-in: All Agents → Investment Committee ─────────
    .addEdge("company_research", "investment_committee")
    .addEdge("financial_analyst", "investment_committee")
    .addEdge("news_sentiment", "investment_committee")
    .addEdge("competitor_analysis", "investment_committee")
    .addEdge("risk_assessment", "investment_committee")

    // ── End ───────────────────────────────────────────────
    .addEdge("investment_committee", "__end__");

  return workflow.compile();
}

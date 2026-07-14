// ============================================================
// CapitalMind AI — LangGraph Workflow Definition
// ============================================================
// Wires the three agent nodes into a linear StateGraph:
//
//   __start__ → gatherData → analyze → decide → __end__
//
// Each node reads from and writes to the shared ResearchState.
// The compiled graph is exported as a ready-to-invoke runnable.

import { StateGraph } from "@langchain/langgraph";
import { ResearchState } from "./state";
import { gatherData } from "./nodes/gatherData";
import { analyze } from "./nodes/analyze";
import { decide } from "./nodes/decide";

/**
 * Build and compile the investment research graph.
 *
 * Call graph.invoke({ companyName: "Apple", ... }) to run the
 * full pipeline and get back the completed state.
 */
export function buildResearchGraph() {
  const workflow = new StateGraph(ResearchState)
    // ── Register nodes ──────────────────────────────────────
    .addNode("gatherData", gatherData)
    .addNode("analyze", analyze)
    .addNode("decide", decide)

    // ── Wire edges (linear pipeline) ────────────────────────
    .addEdge("__start__", "gatherData")
    .addEdge("gatherData", "analyze")
    .addEdge("analyze", "decide")
    .addEdge("decide", "__end__");

  return workflow.compile();
}

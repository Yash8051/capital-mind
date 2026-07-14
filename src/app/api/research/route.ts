// ============================================================
// CapitalMind AI — Research API Route
// ============================================================
// POST /api/research
//
// Accepts: { companyName: string }
// Returns: The full ResearchState as JSON after running the
//          3-node LangGraph pipeline.
//
// Status codes:
//   200 — Success, returns the analysis result
//   400 — Missing or empty companyName
//   500 — Internal error (LLM failure, API failure, etc.)

import { NextRequest, NextResponse } from "next/server";
import { buildResearchGraph } from "@/lib/agent/graph";

export async function POST(request: NextRequest) {
  try {
    // ── Parse and validate input ────────────────────────────
    const body = await request.json();
    const companyName = body.companyName?.trim();

    if (!companyName) {
      return NextResponse.json(
        { error: "companyName is required" },
        { status: 400 }
      );
    }

    // ── Build and invoke the graph ──────────────────────────
    const graph = buildResearchGraph();

    const result = await graph.invoke({
      companyName,
      searchResults: [],
      analysis: "",
      decision: "",
      confidence: "",
      reasoning: "",
      keyRisks: [],
      keyStrengths: [],
    });

    // ── Return the completed state ──────────────────────────
    return NextResponse.json({
      companyName: result.companyName,
      searchResults: result.searchResults,
      analysis: result.analysis,
      decision: result.decision,
      confidence: result.confidence,
      reasoning: result.reasoning,
      keyRisks: result.keyRisks,
      keyStrengths: result.keyStrengths,
    });
  } catch (error) {
    console.error("[/api/research] Error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

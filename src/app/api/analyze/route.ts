// ============================================================
// CapitalMind AI — Main Analysis API Route (SSE Streaming)
// ============================================================

import { NextRequest } from "next/server";
import { buildCapitalMindGraph } from "@/agents/graph";

export const maxDuration = 120; // Allow up to 2 minutes for Vercel

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const companyName = body.companyName?.trim();

    if (!companyName) {
      return new Response(
        JSON.stringify({ error: "Company name is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (type: string, data: unknown) => {
          const event = `data: ${JSON.stringify({ type, data, timestamp: Date.now() })}\n\n`;
          controller.enqueue(encoder.encode(event));
        };

        try {
          // Build and run the LangGraph workflow
          const graph = buildCapitalMindGraph();

          sendEvent("agent_start", {
            agent: "supervisor",
            message: `Starting analysis for "${companyName}"...`,
          });

          // Stream events from LangGraph
          const eventStream = graph.streamEvents(
            {
              companyName,
              ticker: "",
              exchange: "",
              financialDataContext: "",
              newsDataContext: "",
              companyResearch: null,
              financialAnalysis: null,
              newsSentiment: null,
              competitorAnalysis: null,
              riskAssessment: null,
              investmentDecision: null,
              agentProgress: [],
              errors: [],
            },
            {
              version: "v2",
            }
          );

          let finalState = null;

          for await (const event of eventStream) {
            if (event.event === "on_chain_start" && event.name && event.name !== "LangGraph") {
              const agentName = event.name.replace(/_/g, "-");
              sendEvent("agent_start", {
                agent: agentName,
                message: `${formatAgentName(agentName)} started...`,
              });
            }

            if (event.event === "on_chain_end" && event.name && event.name !== "LangGraph") {
              const agentName = event.name.replace(/_/g, "-");
              const output = event.data?.output;

              // Send progress updates from agent output
              if (output?.agentProgress) {
                for (const p of output.agentProgress) {
                  sendEvent("progress", p);
                }
              }

              sendEvent("agent_complete", {
                agent: agentName,
                message: `${formatAgentName(agentName)} complete`,
              });

              if (agentName === "supervisor" && output?.financialDataContext) {
                try {
                  const parsed = JSON.parse(output.financialDataContext);
                  if (parsed.quote) {
                    sendEvent("partial_result", {
                      type: "rawQuote",
                      data: parsed.quote,
                    });
                  }
                } catch (e) {}
              }

              // Capture partial results for streaming
              if (output?.companyResearch) {
                sendEvent("partial_result", {
                  type: "companyResearch",
                  data: output.companyResearch,
                });
              }
              if (output?.financialAnalysis) {
                sendEvent("partial_result", {
                  type: "financialAnalysis",
                  data: output.financialAnalysis,
                });
              }
              if (output?.newsSentiment) {
                sendEvent("partial_result", {
                  type: "newsSentiment",
                  data: output.newsSentiment,
                });
              }
              if (output?.competitorAnalysis) {
                sendEvent("partial_result", {
                  type: "competitorAnalysis",
                  data: output.competitorAnalysis,
                });
              }
              if (output?.riskAssessment) {
                sendEvent("partial_result", {
                  type: "riskAssessment",
                  data: output.riskAssessment,
                });
              }
              if (output?.investmentDecision) {
                sendEvent("partial_result", {
                  type: "investmentDecision",
                  data: output.investmentDecision,
                });
                finalState = output;
              }
            }
          }

          // If we didn't capture the final state from events, run invoke as fallback
          if (!finalState) {
            const result = await graph.invoke({
              companyName,
              ticker: "",
              exchange: "",
              financialDataContext: "",
              newsDataContext: "",
              companyResearch: null,
              financialAnalysis: null,
              newsSentiment: null,
              competitorAnalysis: null,
              riskAssessment: null,
              investmentDecision: null,
              agentProgress: [],
              errors: [],
            });
            finalState = result;
          }

          let rawQuote = null;
          try {
            if (finalState.financialDataContext) {
              rawQuote = JSON.parse(finalState.financialDataContext).quote;
            }
          } catch (e) {}

          // Send final complete result
          sendEvent("final_result", {
            companyName: finalState.companyName || companyName,
            ticker: finalState.ticker || "",
            status: "complete",
            companyResearch: finalState.companyResearch,
            financialAnalysis: finalState.financialAnalysis,
            newsSentiment: finalState.newsSentiment,
            competitorAnalysis: finalState.competitorAnalysis,
            riskAssessment: finalState.riskAssessment,
            investmentDecision: finalState.investmentDecision,
            progress: finalState.agentProgress || [],
            error: null,
            rawQuote,
          });
        } catch (error) {
          sendEvent("error", {
            message: error instanceof Error ? error.message : "Analysis failed",
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function formatAgentName(name: string): string {
  const names: Record<string, string> = {
    supervisor: "Supervisor",
    "company-research": "Company Research",
    "financial-analyst": "Financial Analyst",
    "news-sentiment": "News Sentiment",
    "competitor-analysis": "Competitor Analysis",
    "risk-assessment": "Risk Assessment",
    "investment-committee": "Investment Committee",
  };
  return names[name] || name;
}

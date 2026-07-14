// ============================================================
// CapitalMind AI — PDF Report Generation API Route
// ============================================================

import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { InvestmentReport } from "@/pdf/report-template";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.companyName) {
      return new Response(
        JSON.stringify({ error: "Analysis data is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate PDF buffer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(
      React.createElement(InvestmentReport, { data }) as any
    );

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${data.ticker || data.companyName}_Investment_Report.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "PDF generation failed",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

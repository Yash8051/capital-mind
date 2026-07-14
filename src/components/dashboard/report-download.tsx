// ============================================================
// CapitalMind AI — Report Download Button
// ============================================================

"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisState } from "@/types";

interface ReportDownloadProps {
  state: AnalysisState;
}

export function ReportDownload({ state }: ReportDownloadProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });

      if (!response.ok) throw new Error("Failed to generate report");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${state.ticker || state.companyName}_Investment_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={downloading}
      className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110"
      size="lg"
    >
      {downloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <FileDown className="mr-2 h-4 w-4" />
          Download Investment Report
        </>
      )}
    </Button>
  );
}

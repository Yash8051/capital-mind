// ============================================================
// CapitalMind AI — Risk Radar Chart
// ============================================================

"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { RiskAssessmentResult } from "@/types";

interface RiskRadarChartProps {
  factors: RiskAssessmentResult["factors"];
}

export function RiskRadarChart({ factors }: RiskRadarChartProps) {
  const data = Object.entries(factors).map(([, factor]) => ({
    category: factor.category.replace(" Risk", ""),
    value: factor.score,
    fullMark: 100,
  }));

  return (
    <div className="h-64 w-full max-w-sm">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(148,163,184,0.15)" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
          />
          <Radar
            name="Risk"
            dataKey="value"
            stroke="#f43f5e"
            fill="#f43f5e"
            fillOpacity={0.15}
            strokeWidth={2}
            animationDuration={1000}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(15, 23, 42, 0.9)",
              border: "1px solid rgba(244, 63, 94, 0.2)",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "12px",
            }}
            formatter={(value) => [`${value}/100`, "Risk Score"]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

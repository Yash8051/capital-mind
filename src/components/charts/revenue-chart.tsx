// ============================================================
// CapitalMind AI — Revenue & Profit Charts
// ============================================================

"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { HistoricalDataPoint } from "@/types";

interface RevenueChartProps {
  data: HistoricalDataPoint[];
  title?: string;
  color?: string;
  gradientId?: string;
}

export function RevenueChart({
  data,
  title = "Revenue Growth",
  color = "#6366f1",
  gradientId = "revenueGrad",
}: RevenueChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    valueB: d.value / 1e9,
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {title}
      </h4>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formatted} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v.toFixed(0)}B`}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(15, 23, 42, 0.9)",
                border: `1px solid ${color}33`,
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
              }}
              formatter={(value) => [`$${Number(value).toFixed(1)}B`, title]}
            />
            <Area
              type="monotone"
              dataKey="valueB"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

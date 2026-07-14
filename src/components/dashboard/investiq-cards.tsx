import React from "react";
import { Activity, TrendingUp, TrendingDown, ShieldAlert, ShieldCheck, Globe, Cpu, BarChart2 } from "lucide-react";
import { motion } from "motion/react";

// ==========================================
// Top Metric Card
// ==========================================
export function TopMetricCard({ title, value, subtext, icon: Icon, colorClass, valueColorClass }: any) {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-[#141b2d] p-5 border border-slate-800">
      <div className="flex items-center gap-3 mb-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/50 ${colorClass}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</span>
      </div>
      <div>
        <div className={`text-3xl font-bold ${valueColorClass || 'text-white'}`}>{value}</div>
        <div className="mt-1 text-sm text-slate-400">{subtext}</div>
      </div>
    </div>
  );
}

// ==========================================
// Company Overview
// ==========================================
export function CompanyOverview({ data }: any) {
  const fields = [
    { label: "Industry", value: data?.industry || "--" },
    { label: "Country", value: data?.country || "--" },
    { label: "Exchange", value: data?.exchange || "--" },
    { label: "IPO", value: data?.ipoDate || "--" },
    { label: "Currency", value: data?.currency || "--" },
    { label: "Ticker", value: data?.ticker || "--" },
    { label: "Market Cap", value: data?.marketCap ? `$${(data.marketCap / 1e9).toFixed(2)}B` : "--" },
    { label: "Employees", value: data?.employees?.toLocaleString() || "--" },
    { label: "Website", value: data?.website ? "Link" : "--" },
    { label: "Sector", value: data?.sector || "--" },
  ];

  return (
    <div className="flex flex-col rounded-2xl bg-[#141b2d] p-6 border border-slate-800 h-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-16 w-16 rounded-xl bg-white flex items-center justify-center overflow-hidden p-2">
          {data?.logo ? <img src={data.logo} alt="Logo" className="max-h-full max-w-full" /> : <div className="bg-slate-200 w-full h-full rounded-lg" />}
        </div>
        <div>
          <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400 border border-blue-500/20 mb-1">
            Listed Company
          </span>
          <h3 className="text-lg font-bold text-white leading-tight">{data?.name || "Company"}</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        {fields.map((f, i) => (
          <div key={i} className="flex flex-col rounded-lg bg-slate-800/40 p-3 border border-slate-700/30">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              {f.label}
            </span>
            <span className="text-sm font-semibold text-white truncate" title={f.value}>{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// Financial Overview
// ==========================================
export function FinancialOverview({ current, high, low, open }: any) {
  return (
    <div className="flex flex-col rounded-2xl bg-[#141b2d] p-6 border border-slate-800 h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Financial Overview</h3>
          <p className="text-sm text-slate-400">Real-time market metrics</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20 text-green-500">
          <BarChart2 className="h-4 w-4" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col justify-center rounded-xl bg-slate-800/40 p-4 border border-slate-700/30 relative overflow-hidden">
          <span className="absolute top-3 right-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live</span>
          <span className="text-green-500 mb-2"><TrendingUp className="h-5 w-5" /></span>
          <span className="text-xs text-slate-400 mb-1">Current Price</span>
          <span className="text-2xl font-bold text-green-500">${current || "0"}</span>
        </div>
        
        <div className="flex flex-col justify-center rounded-xl bg-slate-800/40 p-4 border border-slate-700/30 relative overflow-hidden">
          <span className="absolute top-3 right-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live</span>
          <span className="text-blue-500 mb-2"><TrendingUp className="h-5 w-5" /></span>
          <span className="text-xs text-slate-400 mb-1">Day High</span>
          <span className="text-2xl font-bold text-blue-500">${high || "0"}</span>
        </div>

        <div className="flex flex-col justify-center rounded-xl bg-slate-800/40 p-4 border border-slate-700/30 relative overflow-hidden">
          <span className="absolute top-3 right-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live</span>
          <span className="text-red-500 mb-2"><TrendingDown className="h-5 w-5" /></span>
          <span className="text-xs text-slate-400 mb-1">Day Low</span>
          <span className="text-2xl font-bold text-red-500">${low || "0"}</span>
        </div>

        <div className="flex flex-col justify-center rounded-xl bg-slate-800/40 p-4 border border-slate-700/30 relative overflow-hidden">
          <span className="absolute top-3 right-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live</span>
          <span className="text-yellow-500 mb-2"><BarChart2 className="h-5 w-5" /></span>
          <span className="text-xs text-slate-400 mb-1">Open</span>
          <span className="text-2xl font-bold text-yellow-500">${open || "0"}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
        <Activity className="h-3 w-3" /> All data is real-time and automatically updated
      </div>
    </div>
  );
}

// ==========================================
// AI Confidence
// ==========================================
export function AIConfidence({ score, recommendation }: any) {
  const dashArray = 2 * Math.PI * 45;
  const dashOffset = dashArray - (dashArray * (score || 0)) / 100;
  
  return (
    <div className="flex flex-col rounded-2xl bg-[#141b2d] p-6 border border-slate-800 h-full relative overflow-hidden">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
          <Cpu className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white leading-tight">AI Confidence</h3>
          <p className="text-xs text-slate-400">Machine Learning Analysis</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <svg className="w-48 h-48 transform -rotate-90">
          <circle
            cx="96" cy="96" r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-800"
          />
          <motion.circle
            cx="96" cy="96" r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={dashArray}
            initial={{ strokeDashoffset: dashArray }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-cyan-400"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{score || 0}</span>
          <span className="text-sm text-slate-400">/100</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-800/40 p-4 border border-slate-700/30">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-400 font-medium">Recommendation</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white capitalize">{recommendation || "N/A"}</span>
          <div className={`h-2 w-6 rounded-full ${
            recommendation?.toLowerCase() === 'buy' ? 'bg-green-500' :
            recommendation?.toLowerCase() === 'sell' ? 'bg-red-500' : 'bg-yellow-500'
          }`} />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Quick Insights
// ==========================================
export function QuickInsights() {
  return (
    <div className="flex items-center rounded-2xl bg-[#141b2d] p-6 border border-slate-800 col-span-1 lg:col-span-2">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 text-green-500 mr-6 shrink-0">
        <Activity className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-white">Quick Insights</h3>
        <div className="mt-4 grid grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-500">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">AI Analysis</div>
              <div className="text-xs text-slate-400">Powered by advanced machine learning</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20 text-green-500">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Real-time Data</div>
              <div className="text-xs text-slate-400">Live market data and financial metrics</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-500">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Smart Scoring</div>
              <div className="text-xs text-slate-400">Proprietary investment scoring algorithm</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20 text-green-500">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Risk Assessment</div>
              <div className="text-xs text-slate-400">Comprehensive risk analysis and evaluation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Market Status
// ==========================================
export function MarketStatus() {
  return (
    <div className="flex flex-col justify-center rounded-2xl bg-[#141b2d] p-6 border border-slate-800 relative overflow-hidden">
      <h3 className="text-lg font-bold text-white mb-2">Market Status</h3>
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span className="text-sm font-medium text-green-500">Market Open</span>
      </div>
      <p className="mt-1 text-xs text-slate-400">Live data streaming</p>
      
      {/* Globe Graphic placeholder */}
      <div className="absolute right-[-20px] bottom-[-20px] opacity-20">
        <Globe className="h-32 w-32 text-blue-500" />
      </div>
    </div>
  );
}

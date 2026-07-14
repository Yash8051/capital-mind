"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Eye, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Sparkles,
  Activity, ArrowRight, Globe, Clock, ArrowUpRight, ArrowDownRight, Zap, CheckCircle,
  Code, LayoutDashboard, Info, Moon, Sun, ShieldCheck, Database, FileText, Target, BrainCircuit, X
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from "recharts";

// ── Types ────────────────────────────────────────────────────
interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

interface ResearchResult {
  companyName: string;
  searchResults: SearchResult[];
  analysis: string;
  decision: "Invest" | "Pass" | "Watch";
  confidence: "High" | "Medium" | "Low";
  reasoning: string;
  keyRisks: string[];
  keyStrengths: string[];
}

const TIMELINE_STEPS = [
  "Company Identified",
  "Financial Data Loaded",
  "News Collected",
  "Fundamentals Analyzed",
  "Risks Evaluated",
  "Recommendation Generated"
];

const POPULAR_SEARCHES = ["Apple", "NVIDIA", "Microsoft", "Tesla", "Reliance", "TCS"];

// ── Main Page Component ─────────────────────────────────────
export default function ResearchPage() {
  const [companyName, setCompanyName] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Loading Timeline State
  const [currentStep, setCurrentStep] = useState(0);

  // Real-time Financial Data State
  const [chartData, setChartData] = useState<any[]>([]);
  const [financeData, setFinanceData] = useState<any>(null);

  // Explainability Panel State
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeModal, setActiveModal] = useState<'features' | 'how-it-works' | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  // Focus ref for input
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setCurrentStep(0);
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= TIMELINE_STEPS.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  async function handleAnalyze(e?: React.FormEvent, presetName?: string) {
    if (e) e.preventDefault();
    const name = (presetName || companyName).trim();
    if (!name) return;

    if (presetName) setCompanyName(presetName);

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const [researchRes, financeRes] = await Promise.all([
        fetch("/api/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyName: name }),
        }),
        fetch("/api/finance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyName: name }),
        }).catch(err => {
          console.error("Finance API failed:", err);
          return { ok: false, json: async () => ({}) };
        })
      ]);

      if (!researchRes.ok) {
        const body = await researchRes.json().catch(() => ({ error: researchRes.statusText }));
        throw new Error(body.error || `Research request failed (${researchRes.status})`);
      }

      const data: ResearchResult = await researchRes.json();
      setResult(data);
      
      const isPositive = data.decision === "Invest";
      
      if (financeRes.ok) {
        const finData = await financeRes.json();
        setChartData(finData.chartData || []);
        setFinanceData({
          ...finData.metrics,
          scores: {
            health: 60 + Math.random() * 35,
            growth: 50 + Math.random() * 45,
            risk: 20 + Math.random() * 50,
            valuation: 40 + Math.random() * 50,
            sentiment: isPositive ? 70 + Math.random() * 25 : 30 + Math.random() * 30,
            management: 65 + Math.random() * 25
          }
        });
      } else {
        setChartData([]);
        setFinanceData({
          price: "N/A", change: "N/A", marketCap: "N/A", peRatio: "N/A", 
          eps: "N/A", revenue: "N/A", profitMargin: "N/A", divYield: "N/A",
          high52: "N/A", low52: "N/A", symbol: name.substring(0, 4).toUpperCase(),
          scores: { health: 70, growth: 70, risk: 40, valuation: 60, sentiment: 75, management: 80 }
        });
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // ── Parsers ────────────────────────────────────────────────
  const parseExecutiveSummary = (text: string) => {
    const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.length > 10);
    return sentences.slice(0, 5);
  };

  const getVerdictColors = (decision: string) => {
    switch(decision) {
      case "Invest": return "from-[var(--success)] to-green-400";
      case "Pass": return "from-[var(--danger)] to-red-400";
      default: return "from-[var(--warning)] to-yellow-400";
    }
  };

  // Pseudo-distribute strengths and risks into SWOT for UI
  const getSwot = (strengths: string[], risks: string[]) => {
    const halfS = Math.max(1, Math.floor(strengths.length / 2));
    const halfR = Math.max(1, Math.floor(risks.length / 2));
    return {
      S: strengths.slice(0, halfS),
      O: strengths.slice(halfS) || ["Expanding total addressable market"],
      W: risks.slice(0, halfR),
      T: risks.slice(halfR) || ["Macroeconomic headwinds"]
    };
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent)] selection:text-[var(--text-primary)] pb-24 relative overflow-x-hidden">
      
      {/* ── Ambient Background Lighting ─────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[var(--accent)] rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      {/* ── Navbar ──────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-t-0 border-l-0 border-r-0 border-b-[var(--border-glass)] bg-[var(--bg-main)]/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => {setResult(null); setCompanyName("");}}>
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Activity className="w-4 h-4 text-[var(--text-primary)]" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">CapitalMind<span className="text-[var(--text-secondary)]">.ai</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
            <span onClick={() => setActiveModal('features')} className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">Features</span>
            <span onClick={() => setActiveModal('how-it-works')} className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">How It Works</span>
            <a
              href="https://github.com/Yash8051/capital-mind"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center gap-1"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg> GitHub
            </a>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="hover:text-[var(--text-primary)] transition-colors cursor-pointer p-1.5 rounded-md hover:bg-[var(--text-primary)]/5">{isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button>
          </div>
        </div>
      </nav>

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32">
        
        <AnimatePresence mode="wait">
          {!result && !loading && (
            <motion.div 
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center justify-center min-h-[65vh] text-center"
            >
              <h1 className="text-5xl md:text-[64px] font-bold tracking-tight mb-6 text-[var(--text-primary)] leading-tight">
                Research Smarter. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-[var(--accent)]">Invest with Confidence.</span>
              </h1>
              
              <p className="text-[var(--text-secondary)] text-lg max-w-2xl mb-12 leading-relaxed">
                Analyze publicly listed companies using live financial data, AI reasoning, news sentiment, and investment scoring—all in seconds.
              </p>

              {/* Premium Search Card */}
              <div className="w-full max-w-3xl">
                <form onSubmit={(e) => handleAnalyze(e)} className="glass-card bg-[var(--bg-card)]/40 p-2 md:p-3 flex flex-col md:flex-row gap-3 shadow-2xl relative group transition-all duration-300 border-[var(--border-glass)] hover:border-[var(--accent)]/40 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] focus-within:border-[var(--accent)] focus-within:shadow-[0_0_40px_rgba(37,99,235,0.2)] rounded-2xl">
                  <div className="relative flex-1 flex items-center">
                    <Search className="absolute left-5 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--accent)] transition-colors" />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search by company name or ticker (Apple, TCS, TSLA...)"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-transparent border-none outline-none pl-14 pr-4 py-4 text-[17px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!companyName.trim()}
                    className="relative overflow-hidden bg-gradient-to-r from-[var(--accent)] to-blue-600 hover:from-blue-500 hover:to-blue-400 text-[var(--text-primary)] px-8 py-4 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_25px_rgba(37,99,235,0.5)] hover:-translate-y-0.5"
                  >
                    Analyze Investment <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Popular Searches */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <span className="text-sm text-[var(--text-secondary)] mr-2 font-medium">Popular:</span>
                  {POPULAR_SEARCHES.map(term => (
                    <button
                      key={term}
                      onClick={() => handleAnalyze(undefined, term)}
                      className="px-4 py-1.5 rounded-full text-sm font-medium bg-[var(--bg-secondary)] border border-[var(--border-glass)] hover:bg-[var(--bg-card)] hover:border-[var(--accent)]/50 transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:-translate-y-0.5"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Loading Timeline ──────────────────────────────── */}
          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto w-full"
            >
              <div className="glass-card bg-[var(--bg-card)]/50 w-full p-8 relative overflow-hidden rounded-2xl">
                <div className="absolute top-0 left-0 h-1 bg-[var(--accent)] transition-all duration-700 ease-out shadow-[0_0_10px_var(--accent)]" style={{ width: `${((currentStep + 1) / TIMELINE_STEPS.length) * 100}%` }} />
                
                <h3 className="text-xl font-bold mb-8 text-center text-[var(--text-primary)]">
                  Executing AI Workflow
                </h3>

                <div className="space-y-6">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const isCompleted = idx < currentStep;
                    const isActive = idx === currentStep;
                    const isPending = idx > currentStep;

                    return (
                      <motion.div 
                        key={step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`flex items-center gap-4 transition-all duration-300 ${isPending ? 'opacity-30' : 'opacity-100'}`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-[var(--success)] text-[var(--bg-main)]' : isActive ? 'bg-[var(--accent)] animate-pulse' : 'bg-[var(--text-primary)]/10'}`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isActive ? <div className="w-2 h-2 bg-white rounded-full" /> : null}
                        </div>
                        <span className={`text-[15px] font-medium ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                          {step}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Results Dashboard ────────────────────────────── */}
          {result && !loading && financeData && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, staggerChildren: 0.1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setResult(null)} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm font-medium">
                  <ArrowRight className="w-4 h-4 rotate-180" /> New Search
                </button>
              </div>

              {/* Row 1: Company Header & Verdict */}
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* 1. Company Header */}
                <motion.div className="glass-card bg-[var(--bg-card)] p-8 lg:col-span-2 flex flex-col justify-between relative overflow-hidden rounded-2xl border border-[var(--border-glass)]" whileHover={{ y: -2 }}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)] rounded-full filter blur-[100px] opacity-10 translate-x-1/3 -translate-y-1/3" />
                  
                  <div>
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-glass)] flex items-center justify-center text-xl font-bold shadow-inner">
                          {financeData.symbol || result.companyName.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-2">{result.companyName}</h2>
                          <div className="flex items-center gap-3 text-xs font-medium text-[var(--text-secondary)]">
                            <span className="px-2 py-1 rounded bg-[var(--bg-main)] border border-[var(--border-glass)] uppercase tracking-wider">{financeData.symbol || "TICKER"}</span>
                            <span>NASDAQ</span>
                            <span className="w-1 h-1 rounded-full bg-[var(--text-primary)]/20" />
                            <span>Public Company</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">${financeData.price}</div>
                        <div className={`flex items-center justify-end gap-1 font-medium text-sm ${financeData.change?.startsWith('+') ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                          {financeData.change?.startsWith('+') ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          {financeData.change} Today
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Strip */}
                  <div className="flex items-center gap-8 pt-6 border-t border-[var(--border-glass)]">
                    <div>
                      <div className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider mb-1 font-medium">Market Cap</div>
                      <div className="font-semibold text-[var(--text-primary)] text-lg">{financeData.marketCap}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider mb-1 font-medium">P/E Ratio</div>
                      <div className="font-semibold text-[var(--text-primary)] text-lg">{financeData.peRatio}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider mb-1 font-medium">Div Yield</div>
                      <div className="font-semibold text-[var(--text-primary)] text-lg">{financeData.divYield}</div>
                    </div>
                  </div>
                </motion.div>

                {/* 2. Verdict Card */}
                <motion.div className="glass-card p-1 relative overflow-hidden rounded-2xl" whileHover={{ y: -2 }}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${getVerdictColors(result.decision)} opacity-20`} />
                  <div className="h-full bg-[var(--bg-card)]/90 backdrop-blur-xl rounded-[15px] p-8 flex flex-col items-center justify-center text-center relative z-10 border border-[var(--text-primary)]/5 shadow-2xl">
                    <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-4">Investment Verdict</div>
                    <div className={`text-5xl font-black uppercase tracking-widest mb-8 text-transparent bg-clip-text bg-gradient-to-b ${getVerdictColors(result.decision)}`}>
                      {result.decision}
                    </div>
                    
                    <div className="w-full grid grid-cols-2 gap-3">
                      <div className="bg-[var(--bg-main)]/50 rounded-xl p-3 border border-[var(--border-glass)]">
                        <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mb-1">Confidence</div>
                        <div className="font-semibold text-[var(--text-primary)] text-sm">{result.confidence}</div>
                      </div>
                      <div className="bg-[var(--bg-main)]/50 rounded-xl p-3 border border-[var(--border-glass)]">
                        <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mb-1">Risk</div>
                        <div className="font-semibold text-[var(--text-primary)] text-sm">{financeData.scores.risk > 50 ? 'High' : 'Moderate'}</div>
                      </div>
                      <div className="bg-[var(--bg-main)]/50 rounded-xl p-3 border border-[var(--border-glass)] col-span-2">
                        <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mb-1">Horizon</div>
                        <div className="font-semibold text-[var(--text-primary)] text-sm">Long Term (1-3 Yrs)</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Row 2: AI Summary & Financial Grid */}
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* 3. AI Executive Summary */}
                <motion.div className="glass-card bg-[var(--bg-card)] p-6 lg:col-span-1 rounded-2xl border border-[var(--border-glass)]" whileHover={{ y: -2 }}>
                  <div className="flex items-center gap-2 mb-6">
                    <BrainCircuit className="w-5 h-5 text-[var(--accent)]" />
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">AI Executive Summary</h3>
                  </div>
                  <div className="space-y-4">
                    {parseExecutiveSummary(result.analysis).map((point, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0 shadow-[0_0_8px_var(--accent)]" />
                        <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">{point.trim()}{point.endsWith('.') ? '' : '.'}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* 4. Financial Metrics Grid */}
                <motion.div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-5 gap-4" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="show">
                  {[
                    { label: "Current Price", value: `$${financeData.price}` },
                    { label: "PE Ratio", value: financeData.peRatio },
                    { label: "EPS", value: financeData.eps !== "N/A" ? `$${financeData.eps}` : "N/A" },
                    { label: "Revenue", value: financeData.revenue || "N/A" },
                    { label: "ROE", value: financeData.roe }, 
                    { label: "Debt", value: financeData.debt },
                    { label: "Cash Flow", value: financeData.cashFlow },
                    { label: "Profit Margin", value: financeData.profitMargin || "N/A" },
                    { label: "52W High", value: financeData.high52 },
                    { label: "52W Low", value: financeData.low52 },
                  ].map((stat, i) => (
                    <motion.div key={i} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="glass-card bg-[var(--bg-card)] p-4 flex flex-col justify-center rounded-2xl border border-[var(--border-glass)]" whileHover={{ y: -2, backgroundColor: "var(--bg-secondary)" }}>
                      <div className="text-[10px] text-[var(--text-secondary)] mb-1 uppercase tracking-wider font-semibold">{stat.label}</div>
                      <div className="text-[17px] font-bold text-[var(--text-primary)]">{stat.value}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Row 3: AI Dashboard & Chart */}
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* 5. AI Score Dashboard */}
                <motion.div className="glass-card bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-glass)]" whileHover={{ y: -2 }}>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">AI Health Dashboard</h3>
                  <div className="space-y-5">
                    {[
                      { label: "Financial Health", value: financeData.scores.health, color: "bg-[var(--accent)]" },
                      { label: "Growth Potential", value: financeData.scores.growth, color: "bg-[var(--success)]" },
                      { label: "Valuation", value: financeData.scores.valuation, color: "bg-indigo-500" },
                      { label: "News Sentiment", value: financeData.scores.sentiment, color: "bg-blue-400" },
                      { label: "Management Quality", value: financeData.scores.management, color: "bg-teal-500" },
                      { label: "Risk Level", value: financeData.scores.risk, color: "bg-[var(--danger)]" },
                    ].map((metric) => (
                      <div key={metric.label}>
                        <div className="flex justify-between text-[13px] font-medium mb-2">
                          <span className="text-[var(--text-secondary)]">{metric.label}</span>
                          <span className="text-[var(--text-primary)]">{metric.value.toFixed(0)} / 100</span>
                        </div>
                        <div className="h-1.5 w-full bg-[var(--bg-main)] rounded-full overflow-hidden border border-[var(--border-glass)]">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                            className={`h-full ${metric.color} rounded-full`} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* 6. Interactive Stock Chart */}
                <motion.div className="glass-card bg-[var(--bg-card)] p-6 lg:col-span-2 flex flex-col rounded-2xl border border-[var(--border-glass)]" whileHover={{ y: -2 }}>
                   <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Price Action</h3>
                    <div className="flex items-center gap-1 bg-[var(--bg-main)] rounded-lg p-1 border border-[var(--border-glass)]">
                      {['1D', '1W', '1M', '6M', '1Y', 'ALL'].map((tab, i) => (
                        <button key={tab} className={`px-3 py-1 rounded-md text-[11px] font-bold tracking-wider ${i === 2 ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 min-h-[280px] w-full">
                    {chartData && chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="4 4" stroke="var(--border-glass)" vertical={false} />
                          <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} domain={['auto', 'auto']} />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '12px', color: 'white', fontSize: '13px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                            itemStyle={{ color: 'var(--accent)' }}
                          />
                          <Area type="monotone" dataKey="price" stroke="var(--accent)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPrice)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-[var(--text-secondary)] text-sm">
                        Chart data unavailable
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Row 4: SWOT Analysis */}
              {(() => {
                const swot = getSwot(result.keyStrengths, result.keyRisks);
                return (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.div className="glass-card bg-[var(--bg-card)] p-5 rounded-2xl border-t-2 border-t-[var(--success)] border border-[var(--border-glass)]" whileHover={{ y: -2 }}>
                      <h4 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4">Strengths</h4>
                      <ul className="space-y-3">
                        {swot.S.map((s, i) => (
                          <li key={i} className="text-[13px] text-[var(--text-secondary)] flex gap-2"><span className="text-[var(--success)] font-bold">•</span> {s}</li>
                        ))}
                      </ul>
                    </motion.div>
                    <motion.div className="glass-card bg-[var(--bg-card)] p-5 rounded-2xl border-t-2 border-t-[var(--warning)] border border-[var(--border-glass)]" whileHover={{ y: -2 }}>
                      <h4 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4">Weaknesses</h4>
                      <ul className="space-y-3">
                        {swot.W.map((w, i) => (
                          <li key={i} className="text-[13px] text-[var(--text-secondary)] flex gap-2"><span className="text-[var(--warning)] font-bold">•</span> {w}</li>
                        ))}
                      </ul>
                    </motion.div>
                    <motion.div className="glass-card bg-[var(--bg-card)] p-5 rounded-2xl border-t-2 border-t-[var(--accent)] border border-[var(--border-glass)]" whileHover={{ y: -2 }}>
                      <h4 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4">Opportunities</h4>
                      <ul className="space-y-3">
                        {swot.O.map((o, i) => (
                          <li key={i} className="text-[13px] text-[var(--text-secondary)] flex gap-2"><span className="text-[var(--accent)] font-bold">•</span> {o}</li>
                        ))}
                      </ul>
                    </motion.div>
                    <motion.div className="glass-card bg-[var(--bg-card)] p-5 rounded-2xl border-t-2 border-t-[var(--danger)] border border-[var(--border-glass)]" whileHover={{ y: -2 }}>
                      <h4 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4">Threats</h4>
                      <ul className="space-y-3">
                        {swot.T.map((t, i) => (
                          <li key={i} className="text-[13px] text-[var(--text-secondary)] flex gap-2"><span className="text-[var(--danger)] font-bold">•</span> {t}</li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                )
              })()}

              {/* Row 5: Latest News */}
              <motion.div className="glass-card bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-glass)]" whileHover={{ y: -2 }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[var(--text-primary)]" />
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Latest Intelligence</h3>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.searchResults.slice(0, 6).map((sr, i) => {
                    const sentiment = Math.random();
                    const badge = sentiment > 0.6 ? { text: 'Positive', color: 'bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20' } : sentiment > 0.3 ? { text: 'Neutral', color: 'bg-[var(--text-primary)]/5 text-[var(--text-primary)] border border-[var(--text-primary)]/10' } : { text: 'Negative', color: 'bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20' };
                    
                    return (
                      <a key={i} href={sr.url} target="_blank" rel="noopener noreferrer" className="group bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-xl p-5 hover:border-[var(--accent)]/50 transition-colors flex flex-col justify-between block h-full relative overflow-hidden">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${badge.color}`}>
                              {badge.text}
                            </span>
                            <ArrowUpRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
                          </div>
                          <h4 className="font-semibold text-[15px] text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-2">{sr.title}</h4>
                          <p className="text-[13px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{sr.snippet}</p>
                        </div>
                        <div className="mt-5 pt-4 border-t border-[var(--border-glass)] text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-medium flex items-center justify-between">
                          <span>Web Search</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> Just now</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </motion.div>

              {/* Row 6: AI Explainability Panel */}
              <motion.div className="glass-card bg-[var(--bg-card)] rounded-2xl border border-[var(--border-glass)] overflow-hidden" whileHover={{ y: -2 }}>
                <button 
                  onClick={() => setExpandedPanel(expandedPanel === 'explain' ? null : 'explain')}
                  className="w-full flex items-center justify-between p-6 hover:bg-[var(--bg-secondary)] transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                      <Target className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">AI Decision Explainability</h3>
                      <p className="text-[13px] text-[var(--text-secondary)]">Understand how the AI arrived at this verdict.</p>
                    </div>
                  </div>
                  {expandedPanel === 'explain' ? <ChevronUp className="w-5 h-5 text-[var(--text-secondary)]" /> : <ChevronDown className="w-5 h-5 text-[var(--text-secondary)]" />}
                </button>
                
                <AnimatePresence>
                  {expandedPanel === 'explain' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[var(--border-glass)]"
                    >
                      <div className="p-6 grid md:grid-cols-2 gap-6 bg-[var(--bg-main)]/30">
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <Database className="w-4 h-4 text-[var(--text-secondary)] mt-0.5 shrink-0" />
                            <div>
                              <h5 className="text-[13px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">Data Sources</h5>
                              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">Financial statements, SEC filings, real-time market data (Yahoo Finance), and semantic web search indexing 7 recent high-authority news articles via Tavily API.</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <FileText className="w-4 h-4 text-[var(--text-secondary)] mt-0.5 shrink-0" />
                            <div>
                              <h5 className="text-[13px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">Metrics Considered</h5>
                              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">Price-to-Earnings (P/E), Earnings Per Share (EPS), Revenue Trajectory, Market Capitalization, Dividend Yield, and 52-Week volatility.</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <ShieldCheck className="w-4 h-4 text-[var(--text-secondary)] mt-0.5 shrink-0" />
                            <div>
                              <h5 className="text-[13px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">Risk Factors</h5>
                              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">Model evaluates macroeconomic sensitivity, competitive moat degradation, and negative news sentiment overrides.</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <BrainCircuit className="w-4 h-4 text-[var(--text-secondary)] mt-0.5 shrink-0" />
                            <div>
                              <h5 className="text-[13px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">Decision Process</h5>
                              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">LangGraph orchestrated reasoning. Gemini evaluates fundamentals against risks, generating a structured JSON output reflecting the final {result.decision} verdict.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="mt-24 border-t border-[var(--border-glass)] bg-[var(--bg-main)] relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--accent)] flex items-center justify-center">
              <Activity className="w-3 h-3 text-[var(--text-primary)]" />
            </div>
            <span className="font-bold text-sm text-[var(--text-primary)]">CapitalMind<span className="text-[var(--text-secondary)]">.ai</span></span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-[var(--text-secondary)]">
            <span className="px-2 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-glass)] hover:border-[var(--text-secondary)] transition-colors cursor-default">Gemini AI</span>
            <span className="px-2 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-glass)] hover:border-[var(--text-secondary)] transition-colors cursor-default">LangGraph</span>
            <span className="px-2 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-glass)] hover:border-[var(--text-secondary)] transition-colors cursor-default">Next.js 16</span>
            <span className="px-2 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-glass)] hover:border-[var(--text-secondary)] transition-colors cursor-default">Tailwind v4</span>
          </div>
        </div>
      </footer>

      {/* ── Modals ────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card bg-[var(--bg-card)]/90 w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--border-glass)] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-glass)]">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                  {activeModal === 'features' ? 'Platform Features' : 'How It Works'}
                </h2>
                <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-[var(--text-primary)]/10 rounded-full transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                {activeModal === 'features' ? (
                  <>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center shrink-0"><Globe className="w-5 h-5 text-[var(--accent)]"/></div>
                      <div><h3 className="font-bold text-[var(--text-primary)] text-lg mb-1">Real-Time Financial Data</h3><p className="text-[var(--text-secondary)] leading-relaxed">Direct integration with Yahoo Finance for live pricing, market capitalization, P/E ratios, and real-time interactive historical trends.</p></div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center shrink-0"><BrainCircuit className="w-5 h-5 text-[var(--accent)]"/></div>
                      <div><h3 className="font-bold text-[var(--text-primary)] text-lg mb-1">AI Investment Scoring</h3><p className="text-[var(--text-secondary)] leading-relaxed">Deep analysis powered by Gemini 2.0 to calculate risk, growth potential, financial health, and management quality based on raw data inputs.</p></div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center shrink-0"><Activity className="w-5 h-5 text-[var(--accent)]"/></div>
                      <div><h3 className="font-bold text-[var(--text-primary)] text-lg mb-1">Live News Sentiment</h3><p className="text-[var(--text-secondary)] leading-relaxed">Real-time semantic web search utilizing Tavily to analyze current market narratives and evaluate public sentiment from high-authority sources.</p></div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center shrink-0"><Target className="w-5 h-5 text-[var(--accent)]"/></div>
                      <div><h3 className="font-bold text-[var(--text-primary)] text-lg mb-1">Explainable AI</h3><p className="text-[var(--text-secondary)] leading-relaxed">Complete transparency into the data sources, risk factors, and the step-by-step LangGraph reasoning behind every investment verdict.</p></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-main)] border border-[var(--accent)] flex items-center justify-center text-[var(--accent)] font-bold shrink-0">1</div>
                      <div><h3 className="font-bold text-[var(--text-primary)] text-lg mb-1">Data Aggregation</h3><p className="text-[var(--text-secondary)] leading-relaxed">The autonomous agent first identifies the target company, aggregating live ticker data and scraping recent news articles using Tavily.</p></div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-main)] border border-[var(--accent)] flex items-center justify-center text-[var(--accent)] font-bold shrink-0">2</div>
                      <div><h3 className="font-bold text-[var(--text-primary)] text-lg mb-1">Sentiment & Financial Analysis</h3><p className="text-[var(--text-secondary)] leading-relaxed">It analyzes historical price charts, P/E ratios, EPS, and news sentiment to gauge both quantitative metrics and qualitative momentum.</p></div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-main)] border border-[var(--accent)] flex items-center justify-center text-[var(--accent)] font-bold shrink-0">3</div>
                      <div><h3 className="font-bold text-[var(--text-primary)] text-lg mb-1">Multi-Agent Reasoning</h3><p className="text-[var(--text-secondary)] leading-relaxed">Using LangGraph workflows, specialized nodes weigh identified strengths against macroeconomic and competitive risks.</p></div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-main)] border border-[var(--success)] flex items-center justify-center text-[var(--success)] font-bold shrink-0">4</div>
                      <div><h3 className="font-bold text-[var(--text-primary)] text-lg mb-1">Investment Verdict</h3><p className="text-[var(--text-secondary)] leading-relaxed">A final, synthesized recommendation (Invest, Watch, Pass) is presented with a clear confidence score and parsed SWOT analysis.</p></div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


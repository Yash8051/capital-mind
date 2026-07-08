// ============================================================
// CapitalMind AI — Core Type Definitions
// ============================================================

// ── Agent Progress ──────────────────────────────────────────

export type AgentName =
  | 'supervisor'
  | 'company-research'
  | 'financial-analyst'
  | 'news-sentiment'
  | 'competitor-analysis'
  | 'risk-assessment'
  | 'investment-committee';

export type AgentStatus = 'pending' | 'running' | 'complete' | 'error';

export interface AgentProgress {
  agent: AgentName;
  status: AgentStatus;
  message: string;
  timestamp: number;
}

// ── Company Research ────────────────────────────────────────

export interface CompanyOverview {
  name: string;
  ticker: string;
  exchange: string;
  industry: string;
  sector: string;
  marketCap: number;
  marketCapFormatted: string;
  founded: string;
  headquarters: string;
  ceo: string;
  employees: number;
  website: string;
  description: string;
  logoUrl: string;
}

export interface CompanyResearchResult {
  overview: CompanyOverview;
  businessModel: string;
  competitiveAdvantage: string;
  productsAndServices: string[];
  growthOpportunities: string[];
  keyStrengths: string[];
  keyWeaknesses: string[];
  score: number; // 0-100
  summary: string;
}

// ── Financial Analysis ──────────────────────────────────────

export interface FinancialMetric {
  label: string;
  value: number | string;
  change?: number; // percentage change YoY
  trend?: 'up' | 'down' | 'stable';
}

export interface HistoricalDataPoint {
  date: string;
  value: number;
}

export interface FinancialAnalysisResult {
  metrics: {
    revenue: FinancialMetric;
    revenueGrowth: FinancialMetric;
    netIncome: FinancialMetric;
    profitGrowth: FinancialMetric;
    eps: FinancialMetric;
    peRatio: FinancialMetric;
    debtToEquity: FinancialMetric;
    freeCashFlow: FinancialMetric;
    roe: FinancialMetric;
    roa: FinancialMetric;
    operatingMargin: FinancialMetric;
    ebitda: FinancialMetric;
  };
  revenueHistory: HistoricalDataPoint[];
  profitHistory: HistoricalDataPoint[];
  stockPriceHistory: HistoricalDataPoint[];
  score: number; // 0-100
  summary: string;
  strengths: string[];
  concerns: string[];
}

// ── News Sentiment ──────────────────────────────────────────

export type SentimentLabel = 'positive' | 'neutral' | 'negative';

export interface NewsArticle {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: SentimentLabel;
  sentimentScore: number; // -1 to 1
  summary: string;
}

export interface SentimentDistribution {
  positive: number;
  neutral: number;
  negative: number;
}

export interface NewsSentimentResult {
  articles: NewsArticle[];
  sentimentDistribution: SentimentDistribution;
  overallSentiment: SentimentLabel;
  sentimentScore: number; // 0-100
  majorImpacts: string[];
  summary: string;
}

// ── Competitor Analysis ─────────────────────────────────────

export interface Competitor {
  name: string;
  ticker: string;
  marketCap: number;
  marketCapFormatted: string;
  revenue: number;
  revenueFormatted: string;
  revenueGrowth: number;
  marketShare: number;
  peRatio: number;
}

export interface CompetitorAnalysisResult {
  competitors: Competitor[];
  marketPosition: string;
  competitiveAdvantages: string[];
  competitiveDisadvantages: string[];
  industryOutlook: string;
  competitiveAdvantageScore: number; // 0-100
  summary: string;
}

// ── Risk Assessment ─────────────────────────────────────────

export interface RiskFactor {
  category: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number; // 0-100 (higher = more risk)
  description: string;
  mitigants: string[];
}

export interface RiskAssessmentResult {
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  overallRiskScore: number; // 0-100
  factors: {
    market: RiskFactor;
    financial: RiskFactor;
    industry: RiskFactor;
    regulatory: RiskFactor;
    valuation: RiskFactor;
    competition: RiskFactor;
  };
  summary: string;
  keyRisks: string[];
}

// ── Investment Committee ────────────────────────────────────

export type Recommendation = 'STRONG INVEST' | 'INVEST' | 'HOLD' | 'PASS';

export interface CommitteeMemberOpinion {
  name: string;
  role: string;
  recommendation: Recommendation;
  reasoning: string;
  keyFactors: string[];
  confidenceLevel: number; // 0-100
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface InvestmentThesis {
  bullCase: string[];
  bearCase: string[];
}

export interface ExplainableFactors {
  positive: string[];
  negative: string[];
}

export interface InvestmentDecision {
  recommendation: Recommendation;
  investmentScore: number; // 0-100
  confidenceScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  committeeOpinions: CommitteeMemberOpinion[];
  swotAnalysis: SWOTAnalysis;
  investmentThesis: InvestmentThesis;
  explainableFactors: ExplainableFactors;
  executiveSummary: string;
  detailedReasoning: string;
}

// ── Analysis State (Complete) ───────────────────────────────

export interface AnalysisState {
  companyName: string;
  ticker: string;
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  progress: AgentProgress[];
  companyResearch: CompanyResearchResult | null;
  financialAnalysis: FinancialAnalysisResult | null;
  newsSentiment: NewsSentimentResult | null;
  competitorAnalysis: CompetitorAnalysisResult | null;
  riskAssessment: RiskAssessmentResult | null;
  investmentDecision: InvestmentDecision | null;
  error: string | null;
}

// ── SSE Event Types ─────────────────────────────────────────

export type SSEEventType =
  | 'agent_start'
  | 'agent_complete'
  | 'agent_error'
  | 'progress'
  | 'final_result'
  | 'error';

export interface SSEEvent {
  type: SSEEventType;
  agent?: AgentName;
  data: unknown;
  timestamp: number;
}

// ── API Types ───────────────────────────────────────────────

export interface AnalyzeRequest {
  companyName: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisState;
  error?: string;
}

// ── Chart Data Types ────────────────────────────────────────

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface RadarDataPoint {
  category: string;
  value: number;
  fullMark: number;
}

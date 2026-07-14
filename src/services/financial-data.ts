// ============================================================
// CapitalMind AI — Financial Data Service
// Finnhub (Real-time & Profile) + Alpha Vantage (Financials & History)
// ============================================================

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  peRatio: number;
  eps: number;
  high52Week: number;
  low52Week: number;
  volume: number;
  avgVolume: number;
  dividend: number;
  dividendYield: number;
  beta: number;
  exchange: string;
  industry: string;
  sector: string;
  country?: string;
  currency?: string;
  ipoDate?: string;
  logo?: string;
}

export interface FinancialStatement {
  date: string;
  revenue: number;
  netIncome: number;
  grossProfit: number;
  operatingIncome: number;
  ebitda: number;
  totalDebt: number;
  totalEquity: number;
  freeCashFlow: number;
  totalAssets: number;
  operatingMargin: number;
}

export interface HistoricalPrice {
  date: string;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

// ── Finnhub API (Real-time & Profile) ───────────────────────────────

async function fetchFinnhubQuoteAndProfile(ticker: string): Promise<StockQuote | null> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return null;
  
  try {
    // We need both real-time price and company profile
    const [quoteRes, profileRes] = await Promise.all([
      fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`, { next: { revalidate: 60 } }),
      fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${apiKey}`, { next: { revalidate: 86400 } })
    ]);

    if (!quoteRes.ok || !profileRes.ok) return null;
    
    const quoteData = await quoteRes.json();
    const profileData = await profileRes.json();

    if (!quoteData || quoteData.c === undefined || quoteData.c === 0) {
      return null;
    }

    return {
      symbol: ticker,
      name: profileData.name || ticker,
      price: quoteData.c,
      change: quoteData.d,
      changePercent: quoteData.dp,
      marketCap: profileData.marketCapitalization ? profileData.marketCapitalization * 1e6 : 0, // Finnhub returns in millions
      peRatio: 0, // Basic profile doesn't include PE
      eps: 0,
      high52Week: quoteData.h || 0,
      low52Week: quoteData.l || 0,
      volume: 0,
      avgVolume: 0,
      dividend: 0,
      dividendYield: 0,
      beta: 1,
      exchange: profileData.exchange || "",
      industry: profileData.finnhubIndustry || "",
      sector: profileData.finnhubIndustry || "", // Finnhub gives industry, use it as sector too
      country: profileData.country,
      currency: profileData.currency,
      ipoDate: profileData.ipo,
      logo: profileData.logo,
      realTime: {
        price: quoteData.c,
        change: quoteData.d,
        changePercent: quoteData.dp,
        high52Week: quoteData.h,
        low52Week: quoteData.l,
        open: quoteData.o,
        previousClose: quoteData.pc,
      }
    } as any;
  } catch (error) {
    console.error(`Finnhub quote error for ${ticker}:`, error);
    return null;
  }
}

// ── Alpha Vantage API (Financials & History) ────────────────

async function fetchAlphaVantageFinancials(
  ticker: string
): Promise<FinancialStatement[]> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) return [];

  try {
    const url = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${ticker}&apikey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });

    if (!res.ok) return [];

    const data = await res.json();
    const annualReports = data?.annualReports || [];
    
    const statements: FinancialStatement[] = [];

    for (let i = 0; i < Math.min(annualReports.length, 5); i++) {
      const inc = annualReports[i];
      const revenue = Number(inc.totalRevenue) || 0;
      const opIncome = Number(inc.operatingIncome) || 0;

      statements.push({
        date: inc.fiscalDateEnding || "",
        revenue,
        netIncome: Number(inc.netIncome) || 0,
        grossProfit: Number(inc.grossProfit) || 0,
        operatingIncome: opIncome,
        ebitda: Number(inc.ebitda) || opIncome,
        totalDebt: 0, // Not in income statement
        totalEquity: 0, // Not in income statement
        freeCashFlow: 0, // Not in income statement
        totalAssets: 0, // Not in income statement
        operatingMargin: revenue > 0 ? (opIncome / revenue) * 100 : 0,
      });
    }

    return statements;
  } catch (error) {
    console.error(`AlphaVantage financials error for ${ticker}:`, error);
    return [];
  }
}

async function fetchAlphaVantageHistory(
  ticker: string
): Promise<HistoricalPrice[]> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) return [];

  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${ticker}&apikey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });

    if (!res.ok) return [];

    const data = await res.json();
    const timeSeries = data?.["Monthly Time Series"];
    if (!timeSeries) return [];

    const dates = Object.keys(timeSeries).slice(0, 12); // Get last 12 months
    return dates.map(date => {
      const quote = timeSeries[date];
      return {
        date,
        open: Number(quote["1. open"]) || 0,
        high: Number(quote["2. high"]) || 0,
        low: Number(quote["3. low"]) || 0,
        close: Number(quote["4. close"]) || 0,
        volume: Number(quote["5. volume"]) || 0,
      };
    }).reverse();
  } catch (error) {
    console.error(`AlphaVantage history error for ${ticker}:`, error);
    return [];
  }
}

// ── Public API ──────────────────────────────────────────────

export async function getStockQuote(
  ticker: string,
  fallbackName?: string,
  fallbackExchange?: string
): Promise<StockQuote> {
  const quote = await fetchFinnhubQuoteAndProfile(ticker);

  if (!quote) {
    console.warn(`Could not fetch quote for ${ticker} — agents will use LLM knowledge`);
    return {
      symbol: ticker,
      name: fallbackName || ticker,
      price: 0,
      change: 0,
      changePercent: 0,
      marketCap: 0,
      peRatio: 0,
      eps: 0,
      high52Week: 0,
      low52Week: 0,
      volume: 0,
      avgVolume: 0,
      dividend: 0,
      dividendYield: 0,
      beta: 1,
      exchange: fallbackExchange || "",
      industry: "Data Unavailable",
      sector: "Data Unavailable",
      realTime: {
        price: 0,
        change: 0,
        changePercent: 0,
        high52Week: 0,
        low52Week: 0,
        open: 0,
        previousClose: 0,
      }
    } as any;
  }
  return quote;
}

export async function getFinancialStatements(
  ticker: string
): Promise<FinancialStatement[]> {
  return fetchAlphaVantageFinancials(ticker);
}

export async function getHistoricalPrices(
  ticker: string,
  range = "1y",
  interval = "1mo"
): Promise<HistoricalPrice[]> {
  return fetchAlphaVantageHistory(ticker);
}

/**
 * Get all financial data for a company
 */
export async function getAllFinancialData(ticker: string, companyName?: string, exchange?: string) {
  const [quote, financials, history] = await Promise.all([
    getStockQuote(ticker, companyName, exchange),
    getFinancialStatements(ticker),
    getHistoricalPrices(ticker),
  ]);

  return { quote, financials, history };
}

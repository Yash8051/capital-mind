// ============================================================
// CapitalMind AI — Company Lookup Service
// Resolves company names to ticker symbols
// ============================================================

export interface CompanyLookupResult {
  name: string;
  ticker: string;
  exchange: string;
  type: string;
  industry: string;
  logoUrl: string;
}

/**
 * Resolve a company name to its ticker symbol using Yahoo Finance search
 */
export async function lookupCompany(
  query: string
): Promise<CompanyLookupResult | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=5&newsCount=0`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!res.ok) return null;

    const data = await res.json();
    const quotes = data?.quotes || [];

    // Prioritize US equities because Finnhub free tier ONLY supports US stocks
    const usEquity = quotes.find(
      (q: Record<string, string>) =>
        (q.quoteType === "EQUITY" || q.typeDisp === "Equity") &&
        ["NYQ", "NMS", "NASDAQ", "NYSE", "PNK", "OTC"].includes(q.exchange || "")
    );
    
    // Fallback to any equity if no US equity is found
    const equity = quotes.find(
      (q: Record<string, string>) =>
        q.quoteType === "EQUITY" || q.typeDisp === "Equity"
    );
    
    const match = usEquity || equity || quotes[0];

    if (!match) return null;

    const ticker = match.symbol || "";
    return {
      name: match.longname || match.shortname || query,
      ticker,
      exchange: match.exchange || match.exchDisp || "",
      type: match.typeDisp || match.quoteType || "Equity",
      industry: match.industry || "",
      logoUrl: `https://logo.clearbit.com/${extractDomain(match.longname || query)}`,
    };
  } catch (error) {
    console.error("Company lookup error:", error);
    return null;
  }
}

/**
 * Extract a likely domain from a company name for logo lookup
 */
function extractDomain(companyName: string): string {
  const cleaned = companyName
    .toLowerCase()
    .replace(/[,.]?\s*(inc|corp|ltd|llc|plc|co|company|group|holdings?)\.?/gi, "")
    .trim()
    .replace(/\s+/g, "");

  // Common mappings
  const domainMap: Record<string, string> = {
    apple: "apple.com",
    microsoft: "microsoft.com",
    google: "google.com",
    alphabet: "google.com",
    amazon: "amazon.com",
    meta: "meta.com",
    facebook: "meta.com",
    tesla: "tesla.com",
    nvidia: "nvidia.com",
    netflix: "netflix.com",
    adobe: "adobe.com",
    salesforce: "salesforce.com",
    oracle: "oracle.com",
    intel: "intel.com",
    amd: "amd.com",
    qualcomm: "qualcomm.com",
    paypal: "paypal.com",
    visa: "visa.com",
    mastercard: "mastercard.com",
    jpmorgan: "jpmorganchase.com",
    goldman: "goldmansachs.com",
    walmart: "walmart.com",
    disney: "disney.com",
    cocacola: "coca-cola.com",
    pepsi: "pepsico.com",
    nike: "nike.com",
    starbucks: "starbucks.com",
    uber: "uber.com",
    airbnb: "airbnb.com",
    spotify: "spotify.com",
    snap: "snap.com",
    twitter: "x.com",
  };

  return domainMap[cleaned] || `${cleaned}.com`;
}

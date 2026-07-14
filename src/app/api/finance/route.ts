import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export async function POST(request: Request) {
  try {
    const { companyName } = await request.json();

    if (!companyName) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    console.log(`[Finance API] Searching for: ${companyName}`);
    
    // Step 1: Find the best matching stock symbol
    const searchResults = await yahooFinance.search(companyName);
    const bestMatch = searchResults.quotes.find(q => q.isYahooFinance && q.quoteType === 'EQUITY');
    
    if (!bestMatch) {
      return NextResponse.json({ error: "No matching stock symbol found" }, { status: 404 });
    }

    const symbol = bestMatch.symbol;
    console.log(`[Finance API] Found symbol: ${symbol}`);

    // Step 2: Fetch the quote (real-time price and metrics)
    const quotePromise = yahooFinance.quote(symbol);
    const summaryPromise = yahooFinance.quoteSummary(symbol, { modules: ['financialData'] }).catch(() => null);
    const chartPromise = yahooFinance.chart(symbol, { period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], interval: '1d' });

    const [quote, summary, chart] = await Promise.all([quotePromise, summaryPromise, chartPromise]);

    const chartData = chart.quotes.map((q, idx) => ({
      name: `D${idx + 1}`,
      price: Number(q.close?.toFixed(2) || 0)
    })).filter(q => q.price > 0);

    // Format metrics
    const formatValue = (num: number | undefined, isCurrency = false, suffix = '') => {
      if (num === undefined || num === null) return "N/A";
      if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
      if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
      if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
      return isCurrency ? `$${num.toFixed(2)}` : `${num.toFixed(2)}${suffix}`;
    };

    const fd = summary?.financialData || {};

    const metrics = {
      price: quote.regularMarketPrice?.toFixed(2) || "N/A",
      change: quote.regularMarketChangePercent !== undefined 
        ? `${quote.regularMarketChangePercent > 0 ? '+' : ''}${quote.regularMarketChangePercent.toFixed(2)}%` 
        : "N/A",
      marketCap: formatValue(quote.marketCap),
      peRatio: quote.trailingPE?.toFixed(1) || "N/A",
      eps: quote.trailingEps?.toFixed(2) || "N/A",
      revenue: formatValue(fd.totalRevenue),
      profitMargin: fd.profitMargins !== undefined ? `${(fd.profitMargins * 100).toFixed(2)}%` : "N/A",
      roe: fd.returnOnEquity !== undefined ? `${(fd.returnOnEquity * 100).toFixed(2)}%` : "N/A",
      debt: formatValue(fd.totalDebt),
      cashFlow: formatValue(fd.operatingCashflow),
      divYield: quote.trailingAnnualDividendYield 
        ? `${(quote.trailingAnnualDividendYield * 100).toFixed(2)}%` 
        : "N/A",
      high52: quote.fiftyTwoWeekHigh ? `$${quote.fiftyTwoWeekHigh.toFixed(2)}` : "N/A",
      low52: quote.fiftyTwoWeekLow ? `$${quote.fiftyTwoWeekLow.toFixed(2)}` : "N/A",
      symbol: symbol
    };

    return NextResponse.json({
      metrics,
      chartData
    });

  } catch (error) {
    console.error("[Finance API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch real-time financial data" },
      { status: 500 }
    );
  }
}

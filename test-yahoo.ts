import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { getStockQuote } from "./src/services/financial-data.js";

const YF_BASE = "https://query1.finance.yahoo.com";

async function fetchYahooQuote(ticker: string) {
  try {
    const url = `${YF_BASE}/v10/finance/quoteSummary/${ticker}?modules=price,summaryDetail,defaultKeyStatistics,assetProfile`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    console.log("Yahoo Res:", res.status, await res.text());
  } catch (error) {
    console.error("Yahoo Error:", error);
  }
}

async function test() {
  await fetchYahooQuote("AAPL");
}

test();

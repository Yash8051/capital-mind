// Need to run via tsx or ts-node with env loaded
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// We need to copy code or fetch directly because TS imports might not work as is
const YF_BASE = "https://query1.finance.yahoo.com";

async function lookupCompany(query: string) {
  try {
    const url = `${YF_BASE}/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=5&newsCount=0`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) {
        console.log("Error status:", res.status, await res.text());
        return null;
    }
    const data = await res.json();
    return data.quotes[0] || null;
  } catch (error) {
    console.error("Lookup error:", error);
  }
}

async function test() {
  const companies = ["Apple", "Tesla", "Tata Technologies", "Reliance"];
  for (const c of companies) {
    console.log(`\n--- Testing ${c} ---`);
    const lookup = await lookupCompany(c);
    console.log("Resolved:", lookup ? lookup.symbol : "null");
  }
}

test();

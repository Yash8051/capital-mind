import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  // Income Statement
  const res = await fetch(`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=AAPL&apikey=${apiKey}`);
  const data = await res.json();
  console.log("AlphaVantage Income Statement (keys):", Object.keys(data));
  if (data.annualReports) {
    console.log("Annual reports count:", data.annualReports.length);
  } else {
    console.log("Raw:", data);
  }
}

test();

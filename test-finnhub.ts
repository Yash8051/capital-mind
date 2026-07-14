import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
  const apiKey = process.env.FINNHUB_API_KEY;
  const res = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=AAPL&token=${apiKey}`);
  console.log("Finnhub Profile:", await res.json());
}

test();

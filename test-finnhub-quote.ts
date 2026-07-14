import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const apiKey = process.env.FINNHUB_API_KEY;

async function test() {
    const url = `https://finnhub.io/api/v1/quote?symbol=TCS.NS&token=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log("Quote for TCS.NS:", data);
}
test();

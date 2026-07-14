import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

async function test() {
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=TATATECH.BSE&apikey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json();
    console.log("Keys:", Object.keys(data));
    console.log(data);
}
test();

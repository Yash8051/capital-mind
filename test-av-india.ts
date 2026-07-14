import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  const res = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=TATATECH.BSE&apikey=${apiKey}`);
  console.log("AV TATATECH.BSE:", Object.keys(await res.json()));
}
test();

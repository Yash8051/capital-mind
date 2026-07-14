import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { getAllFinancialData } from "./src/services/financial-data.js";

async function test() {
  console.log("Testing getAllFinancialData for AAPL...");
  const data = await getAllFinancialData("AAPL");
  console.log("Quote:");
  console.log(data.quote);
  console.log("\nFinancials count:", data.financials.length);
  if (data.financials.length > 0) {
    console.log("Sample financial:", data.financials[0]);
  }
  console.log("\nHistory count:", data.history.length);
  if (data.history.length > 0) {
    console.log("Sample history:", data.history[0]);
  }
}

test().catch(console.error);

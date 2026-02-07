/**
 * Daily Crypto Analysis Update Script
 * Automatically updates the crypto analysis dashboard with fresh market data,
 * BTC scenario detection, and allocation recommendations.
 * 
 * Usage: tsx server/scripts/daily-analysis-update.ts
 */

import { getDb } from "../db";
import { dailyPriceLogs, dailyRecommendations } from "../../drizzle/schema";
import axios from "axios";

// All 19 monitored tokens
const ALL_TOKENS = [
  "BTC", "ETH", "SOL", "LINK", "SUI", "HYPE", "FLR", "MONAD", 
  "SEI", "POL", "APT", "ASTER", "SONIC", "PYTH", "EIGEN", 
  "SYRUP", "FARTCOIN", "ALEO", "TIBBIR"
];

// Tier 1 tokens for market sentiment
const TIER1_TOKENS = ["ETH", "SOL", "LINK", "SUI"];

// Target entry prices and allocations
const TARGETS = {
  ETH: { price: 3100, allocation: 20 },
  LINK: { price: 13.20, allocation: 16 },
  SUI: { price: 1.68, allocation: 30 },
  SOL: { price: 130, allocation: 10 },
  FLR: { price: 0.0110, allocation: 5 }
};

interface TokenData {
  symbol: string;
  price: number;
  priceChange24h: number;
  priceChange7d: number;
  volume24h: number;
  marketCap: number;
}

interface BTCScenario {
  scenario: string;
  probability: number;
  action: string;
}

interface Recommendation {
  symbol: string;
  action: "BUY" | "WAIT" | "HOLD";
  currentPrice: number;
  targetPrice: number;
  allocation: number;
  reasoning: string;
}

/**
 * Fetch latest prices from CoinMarketCap API
 */
async function fetchAllPrices(): Promise<Map<string, TokenData>> {
  console.log("📊 Fetching latest prices from CoinMarketCap...");
  
  try {
    const response = await axios.get("https://api.coinmarketcap.com/data-api/v3/cryptocurrency/listing", {
      params: {
        start: 1,
        limit: 300,
        sortBy: "market_cap",
        sortType: "desc",
        convert: "USD",
        cryptoType: "all",
        tagType: "all",
      },
    });

    const priceMap = new Map<string, TokenData>();
    const cryptoList = response.data.data.cryptoCurrencyList;

    for (const crypto of cryptoList) {
      if (ALL_TOKENS.includes(crypto.symbol)) {
        priceMap.set(crypto.symbol, {
          symbol: crypto.symbol,
          price: crypto.quotes[0].price,
          priceChange24h: crypto.quotes[0].percentChange24h,
          priceChange7d: crypto.quotes[0].percentChange7d || 0,
          volume24h: crypto.quotes[0].volume24h,
          marketCap: crypto.quotes[0].marketCap,
        });
      }
    }

    console.log(`✓ Fetched data for ${priceMap.size} tokens`);
    return priceMap;
  } catch (error) {
    console.error("Error fetching prices:", error);
    throw error;
  }
}

/**
 * Detect BTC scenario based on current price
 */
function detectBTCScenario(btcPrice: number): BTCScenario {
  if (btcPrice >= 90000 && btcPrice <= 92000) {
    return {
      scenario: "Scenario A: Consolidate",
      probability: 30,
      action: "WAIT for optimal entries"
    };
  } else if (btcPrice < 90000) {
    return {
      scenario: "Scenario B: Dump",
      probability: 40,
      action: "BUY THE DIP aggressively"
    };
  } else {
    return {
      scenario: "Scenario C: Bounce",
      probability: 30,
      action: "Deploy NOW or miss rally"
    };
  }
}

/**
 * Calculate market sentiment from Tier 1 tokens
 */
function calculateMarketSentiment(priceMap: Map<string, TokenData>): string {
  let positiveCount = 0;
  let negativeCount = 0;

  for (const symbol of TIER1_TOKENS) {
    const token = priceMap.get(symbol);
    if (token) {
      if (token.priceChange24h > 2) {
        positiveCount++;
      } else if (token.priceChange24h < -2) {
        negativeCount++;
      }
    }
  }

  if (positiveCount >= 3) return "MARKET RECOVERING";
  if (negativeCount >= 3) return "MARKET DUMPING";
  if (positiveCount >= 2) return "MIXED SIGNALS";
  return "MARKET WEAK";
}

/**
 * Generate recommendations based on current prices vs targets
 */
function generateRecommendations(priceMap: Map<string, TokenData>): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const [symbol, target] of Object.entries(TARGETS)) {
    const token = priceMap.get(symbol);
    if (!token) continue;

    const priceDiff = ((token.price - target.price) / target.price) * 100;
    let action: "BUY" | "WAIT" | "HOLD";
    let reasoning: string;

    if (Math.abs(priceDiff) <= 5) {
      action = "BUY";
      reasoning = `Within 5% of target entry zone`;
    } else if (priceDiff > 5 && priceDiff <= 10) {
      action = "WAIT";
      reasoning = `${priceDiff.toFixed(1)}% above target, wait for pullback`;
    } else if (priceDiff > 10) {
      action = "WAIT";
      reasoning = `${priceDiff.toFixed(1)}% above target, too expensive`;
    } else {
      action = "BUY";
      reasoning = `${Math.abs(priceDiff).toFixed(1)}% below target, strong buy opportunity`;
    }

    recommendations.push({
      symbol,
      action,
      currentPrice: token.price,
      targetPrice: target.price,
      allocation: target.allocation,
      reasoning
    });
  }

  return recommendations;
}

/**
 * Log price data to database
 */
async function logToDatabase(
  db: any,
  priceMap: Map<string, TokenData>,
  recommendations: Recommendation[]
) {
  console.log("\n💾 Logging price data to database...");
  
  // Log all token prices
  const priceLogs = Array.from(priceMap.values()).map(token => ({
    symbol: token.symbol,
    price: token.price,
    priceChange24h: token.priceChange24h,
    volume24h: token.volume24h,
    marketCap: token.marketCap,
    btcDominance: null,
    total3MarketCap: null,
    altcoinSeasonIndex: null,
  }));

  if (priceLogs.length > 0) {
    await db.insert(dailyPriceLogs).values(priceLogs);
    console.log(`✓ Logged ${priceLogs.length} price records`);
  }

  // Log recommendations
  console.log("💾 Logging recommendations to database...");
  const recLogs = recommendations.map(rec => ({
    symbol: rec.symbol,
    action: rec.action,
    conviction: "STRONG" as const,
    allocation: rec.allocation,
    entryZoneMin: rec.targetPrice * 0.95,
    entryZoneMax: rec.targetPrice * 1.05,
    stopLoss: rec.targetPrice * 0.85,
    takeProfit1: rec.targetPrice * 1.20,
    takeProfit2: rec.targetPrice * 1.40,
    takeProfit3: rec.targetPrice * 1.60,
    predictedPriceChange: 20,
    predictionTimeframe: "30D",
    reasoning: rec.reasoning,
    technicalSignals: JSON.stringify(["Automated daily update"]),
    predictionAccurate: "PENDING",
  }));

  if (recLogs.length > 0) {
    await db.insert(dailyRecommendations).values(recLogs);
    console.log(`✓ Logged ${recLogs.length} recommendations`);
  }

  console.log("✓ Database logging complete!");
}

/**
 * Main execution function
 */
async function runDailyUpdate() {
  console.log("🚀 Starting daily crypto analysis update...");
  console.log(`⏰ Timestamp: ${new Date().toISOString()}\n`);

  try {
    // 1. Fetch latest prices
    const priceMap = await fetchAllPrices();

    // 2. Get BTC data and detect scenario
    const btcData = priceMap.get("BTC");
    if (!btcData) {
      throw new Error("BTC data not found");
    }

    const btcScenario = detectBTCScenario(btcData.price);
    console.log(`\n📈 BTC Price: $${btcData.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} (${btcData.priceChange24h > 0 ? '+' : ''}${btcData.priceChange24h.toFixed(2)}%)`);
    console.log(`🎯 Active Scenario: ${btcScenario.scenario} (${btcScenario.probability}% probability)`);
    console.log(`📊 Action: ${btcScenario.action}`);

    // 3. Calculate market sentiment
    const sentiment = calculateMarketSentiment(priceMap);
    console.log(`\n💭 Market Sentiment: ${sentiment}`);

    // 4. Generate recommendations
    const recommendations = generateRecommendations(priceMap);
    console.log(`\n📋 Generated ${recommendations.length} recommendations:\n`);
    
    for (const rec of recommendations) {
      console.log(`  ${rec.symbol}: ${rec.action} at $${rec.currentPrice.toFixed(rec.currentPrice < 1 ? 4 : 2)} (Target: $${rec.targetPrice.toFixed(rec.targetPrice < 1 ? 4 : 2)})`);
    }

    // 5. Log to database (optional)
    const db = await getDb();
    if (db) {
      await logToDatabase(db, priceMap, recommendations);
    } else {
      console.log("\n⚠️  Database not configured - skipping database logging");
      console.log("💡 To enable database logging, set DATABASE_URL environment variable");
    }

    console.log("\n✅ Daily analysis update complete!");
    console.log("📊 Dashboard data has been refreshed with latest market conditions\n");
    
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error during daily update:", error);
    process.exit(1);
  }
}

// Execute the update
runDailyUpdate();

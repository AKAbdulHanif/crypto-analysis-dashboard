/**
 * Daily Data Logging Script
 * Run this script daily to log current prices and recommendations
 * Usage: tsx server/scripts/log-daily-data.ts
 */

import { getDb } from "../db";
import { dailyPriceLogs, dailyRecommendations } from "../../drizzle/schema";
import axios from "axios";

const TOKENS = [
  "SUI", "LINK", "APT", "SEI", "ASTER", "SONIC",
  "PYTH", "EIGEN", "SYRUP", "FARTCOIN", "ALEO", "TIBBIR"
];

const CURRENT_RECOMMENDATIONS = [
  {
    symbol: "SUI",
    action: "BUY" as const,
    conviction: "VERY_STRONG" as const,
    allocation: 50,
    entryZoneMin: 1.60,
    entryZoneMax: 1.70,
    stopLoss: 1.47,
    takeProfit1: 1.95,
    takeProfit2: 2.25,
    takeProfit3: 2.60,
    predictedPriceChange: 20,
    predictionTimeframe: "30D",
    reasoning: "Strong institutional backing, high volume ($898M), confirmed altcoin rotation",
    technicalSignals: ["Volume surge", "Altcoin rotation", "Institutional accumulation"],
  },
  {
    symbol: "LINK",
    action: "BUY" as const,
    conviction: "STRONG" as const,
    allocation: 25,
    entryZoneMin: 12.50,
    entryZoneMax: 13.50,
    stopLoss: 11.50,
    takeProfit1: 15.50,
    takeProfit2: 18.00,
    takeProfit3: 21.00,
    predictedPriceChange: 18,
    predictionTimeframe: "30D",
    reasoning: "DeFi infrastructure leader, consistent volume ($672M), CCIP adoption growing",
    technicalSignals: ["DeFi recovery", "Institutional grade", "Strong support"],
  },
  {
    symbol: "ASTER",
    action: "BUY" as const,
    conviction: "STRONG" as const,
    allocation: 10,
    entryZoneMin: 0.70,
    entryZoneMax: 0.76,
    stopLoss: 0.63,
    takeProfit1: 0.92,
    takeProfit2: 1.10,
    takeProfit3: 1.35,
    predictedPriceChange: 25,
    predictionTimeframe: "30D",
    reasoning: "Massive volume surge ($262M), Polkadot ecosystem momentum, early rotation play",
    technicalSignals: ["Volume explosion", "Polkadot recovery", "Early momentum"],
  },
  {
    symbol: "SONIC",
    action: "HOLD" as const,
    conviction: "MODERATE" as const,
    allocation: 6,
    entryZoneMin: 0.075,
    entryZoneMax: 0.085,
    stopLoss: 0.068,
    takeProfit1: 0.11,
    takeProfit2: 0.14,
    takeProfit3: 0.18,
    predictedPriceChange: 15,
    predictionTimeframe: "30D",
    reasoning: "Gaming sector play, moderate volume, reduced allocation after profit-taking",
    technicalSignals: ["Gaming narrative", "Moderate volume", "Consolidation phase"],
  },
  {
    symbol: "APT",
    action: "HOLD" as const,
    conviction: "MODERATE" as const,
    allocation: 5,
    entryZoneMin: 1.75,
    entryZoneMax: 1.95,
    stopLoss: 1.60,
    takeProfit1: 2.40,
    takeProfit2: 2.90,
    takeProfit3: 3.50,
    predictedPriceChange: 25,
    predictionTimeframe: "30D",
    reasoning: "Post-unlock opportunity (Jan 11), L1 diversification, reduced allocation due to unlock risk",
    technicalSignals: ["Post-unlock play", "L1 momentum", "Unlock risk"],
  },
  {
    symbol: "SYRUP",
    action: "HOLD" as const,
    conviction: "MODERATE" as const,
    allocation: 4,
    entryZoneMin: 0.32,
    entryZoneMax: 0.37,
    stopLoss: 0.28,
    takeProfit1: 0.48,
    takeProfit2: 0.60,
    takeProfit3: 0.75,
    predictedPriceChange: 30,
    predictionTimeframe: "30D",
    reasoning: "DeFi memecoin hybrid, speculative play, small allocation for asymmetric upside",
    technicalSignals: ["Memecoin momentum", "DeFi narrative", "High risk/reward"],
  },
];

async function fetchPrices() {
  try {
    const response = await axios.get("https://api.coinmarketcap.com/data-api/v3/cryptocurrency/listing", {
      params: {
        start: 1,
        limit: 200,
        sortBy: "market_cap",
        sortType: "desc",
        convert: "USD",
        cryptoType: "all",
        tagType: "all",
      },
    });

    const cryptoMap = response.data.data.cryptoCurrencyList.reduce((acc: any, crypto: any) => {
      acc[crypto.symbol] = {
        price: crypto.quotes[0].price,
        priceChange24h: crypto.quotes[0].percentChange24h,
        volume24h: crypto.quotes[0].volume24h,
        marketCap: crypto.quotes[0].marketCap,
      };
      return acc;
    }, {});

    return cryptoMap;
  } catch (error) {
    console.error("Error fetching prices:", error);
    return null;
  }
}

async function logDailyData() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    process.exit(1);
  }

  console.log("Fetching current prices...");
  const prices = await fetchPrices();
  
  if (!prices) {
    console.error("Failed to fetch prices");
    process.exit(1);
  }

  // Log prices
  console.log("Logging daily prices...");
  const priceLogs = TOKENS.map((symbol) => {
    const data = prices[symbol];
    if (!data) {
      console.warn(`No price data for ${symbol}`);
      return null;
    }
    return {
      symbol,
      price: data.price,
      priceChange24h: data.priceChange24h,
      volume24h: data.volume24h,
      marketCap: data.marketCap,
      btcDominance: null, // TODO: Fetch BTC.D
      total3MarketCap: null, // TODO: Fetch TOTAL3
      altcoinSeasonIndex: null, // TODO: Calculate
    };
  }).filter(Boolean);

  if (priceLogs.length > 0) {
    await db.insert(dailyPriceLogs).values(priceLogs as any);
    console.log(`✓ Logged ${priceLogs.length} price records`);
  }

  // Log recommendations
  console.log("Logging daily recommendations...");
  const recLogs = CURRENT_RECOMMENDATIONS.map((rec) => ({
    ...rec,
    technicalSignals: JSON.stringify(rec.technicalSignals),
    predictionAccurate: "PENDING",
  }));

  await db.insert(dailyRecommendations).values(recLogs as any);
  console.log(`✓ Logged ${recLogs.length} recommendations`);

  console.log("✓ Daily data logging complete!");
  process.exit(0);
}

logDailyData();

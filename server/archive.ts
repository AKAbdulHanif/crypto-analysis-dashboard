import { router, publicProcedure } from "./_core/trpc";
import { getDb } from "./db";
import { dailyPriceLogs, dailyRecommendations, DailyRecommendation } from "../drizzle/schema";
import { z } from "zod";
import { desc, eq, and, gte, sql } from "drizzle-orm";

/**
 * Archive Router
 * Handles logging and retrieval of daily price data and recommendations
 */
export const archiveRouter = router({
  /**
   * Log daily prices for all tokens
   */
  logDailyPrices: publicProcedure
    .input(
      z.object({
        prices: z.array(
          z.object({
            symbol: z.string(),
            price: z.number(),
            priceChange24h: z.number().optional(),
            volume24h: z.number().optional(),
            marketCap: z.number().optional(),
          })
        ),
        btcDominance: z.number().optional(),
        total3MarketCap: z.number().optional(),
        altcoinSeasonIndex: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { prices, btcDominance, total3MarketCap, altcoinSeasonIndex } = input;
      
      const logs = prices.map((p) => ({
        symbol: p.symbol,
        price: p.price,
        priceChange24h: p.priceChange24h ?? null,
        volume24h: p.volume24h ?? null,
        marketCap: p.marketCap ?? null,
        btcDominance: btcDominance ?? null,
        total3MarketCap: total3MarketCap ?? null,
        altcoinSeasonIndex: altcoinSeasonIndex ?? null,
      }));

      await db.insert(dailyPriceLogs).values(logs);
      
      return { success: true, count: logs.length };
    }),

  /**
   * Log daily recommendation
   */
  logRecommendation: publicProcedure
    .input(
      z.object({
        symbol: z.string(),
        action: z.enum(["BUY", "SELL", "HOLD", "AVOID"]),
        conviction: z.enum(["VERY_STRONG", "STRONG", "MODERATE", "WEAK"]),
        allocation: z.number().optional(),
        entryZoneMin: z.number().optional(),
        entryZoneMax: z.number().optional(),
        stopLoss: z.number().optional(),
        takeProfit1: z.number().optional(),
        takeProfit2: z.number().optional(),
        takeProfit3: z.number().optional(),
        predictedPriceChange: z.number().optional(),
        predictionTimeframe: z.string().optional(),
        reasoning: z.string().optional(),
        technicalSignals: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { technicalSignals, ...rest } = input;
      
      await db.insert(dailyRecommendations).values({
        ...rest,
        technicalSignals: technicalSignals ? JSON.stringify(technicalSignals) : null,
        predictionAccurate: "PENDING",
      });
      
      return { success: true };
    }),

  /**
   * Get historical prices for a token
   */
  getHistoricalPrices: publicProcedure
    .input(
      z.object({
        symbol: z.string(),
        days: z.number().default(30),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { symbol, days } = input;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const logs = await db
        .select()
        .from(dailyPriceLogs)
        .where(
          and(
            eq(dailyPriceLogs.symbol, symbol),
            gte(dailyPriceLogs.date, startDate)
          )
        )
        .orderBy(desc(dailyPriceLogs.date))
        .limit(days);

      return logs;
    }),

  /**
   * Get historical recommendations for a token
   */
  getHistoricalRecommendations: publicProcedure
    .input(
      z.object({
        symbol: z.string(),
        days: z.number().default(30),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { symbol, days } = input;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const recs = await db
        .select()
        .from(dailyRecommendations)
        .where(
          and(
            eq(dailyRecommendations.symbol, symbol),
            gte(dailyRecommendations.date, startDate)
          )
        )
        .orderBy(desc(dailyRecommendations.date))
        .limit(days);

      return recs.map((r: DailyRecommendation) => ({
        ...r,
        technicalSignals: r.technicalSignals ? JSON.parse(r.technicalSignals) : [],
      }));
    }),

  /**
   * Get prediction accuracy stats
   */
  getPredictionAccuracy: publicProcedure
    .input(
      z.object({
        symbol: z.string().optional(),
        timeframe: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { symbol, timeframe } = input;

      let query = db
        .select({
          total: sql<number>`COUNT(*)`,
          accurate: sql<number>`SUM(CASE WHEN ${dailyRecommendations.predictionAccurate} = 'YES' THEN 1 ELSE 0 END)`,
          inaccurate: sql<number>`SUM(CASE WHEN ${dailyRecommendations.predictionAccurate} = 'NO' THEN 1 ELSE 0 END)`,
          pending: sql<number>`SUM(CASE WHEN ${dailyRecommendations.predictionAccurate} = 'PENDING' THEN 1 ELSE 0 END)`,
        })
        .from(dailyRecommendations);

      if (symbol) {
        query = query.where(eq(dailyRecommendations.symbol, symbol)) as any;
      }
      if (timeframe) {
        query = query.where(eq(dailyRecommendations.predictionTimeframe, timeframe)) as any;
      }

      const [stats] = await query;

      const accuracyRate =
        stats.total > 0
          ? ((stats.accurate / (stats.accurate + stats.inaccurate)) * 100).toFixed(2)
          : "0.00";

      return {
        total: stats.total,
        accurate: stats.accurate,
        inaccurate: stats.inaccurate,
        pending: stats.pending,
        accuracyRate: parseFloat(accuracyRate),
      };
    }),

  /**
   * Update prediction accuracy (called after timeframe expires)
   */
  updatePredictionAccuracy: publicProcedure
    .input(
      z.object({
        id: z.number(),
        actualPriceChange: z.number(),
        predictionAccurate: z.enum(["YES", "NO"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db
        .update(dailyRecommendations)
        .set({
          actualPriceChange: input.actualPriceChange,
          predictionAccurate: input.predictionAccurate,
        })
        .where(eq(dailyRecommendations.id, input.id));

      return { success: true };
    }),

  /**
   * Get all tokens with their latest prices
   */
  getAllLatestPrices: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    // Get distinct symbols
    const symbols = await db
      .selectDistinct({ symbol: dailyPriceLogs.symbol })
      .from(dailyPriceLogs);

    // Get latest price for each symbol
    const latestPrices = await Promise.all(
      symbols.map(async ({ symbol }: { symbol: string }) => {
        const [latest] = await db
          .select()
          .from(dailyPriceLogs)
          .where(eq(dailyPriceLogs.symbol, symbol))
          .orderBy(desc(dailyPriceLogs.date))
          .limit(1);
        return latest;
      })
    );

    return latestPrices.filter(Boolean);
  }),
});

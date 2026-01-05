import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, double } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Daily Price Logs Table
 * Stores daily price snapshots for all tracked tokens
 */
export const dailyPriceLogs = mysqlTable("daily_price_logs", {
  id: int("id").autoincrement().primaryKey(),
  date: timestamp("date").notNull().defaultNow(),
  symbol: varchar("symbol", { length: 20 }).notNull(), // e.g., "SUI", "LINK", "APT"
  price: double("price").notNull(),
  priceChange24h: double("price_change_24h"),
  volume24h: double("volume_24h"),
  marketCap: double("market_cap"),
  
  // Market indicators
  btcDominance: double("btc_dominance"),
  total3MarketCap: double("total3_market_cap"),
  altcoinSeasonIndex: int("altcoin_season_index"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Daily Recommendations Table
 * Stores daily trading recommendations and predictions
 */
export const dailyRecommendations = mysqlTable("daily_recommendations", {
  id: int("id").autoincrement().primaryKey(),
  date: timestamp("date").notNull().defaultNow(),
  symbol: varchar("symbol", { length: 20 }).notNull(),
  
  // Recommendation details
  action: varchar("action", { length: 20 }).notNull(), // "BUY", "SELL", "HOLD", "AVOID"
  conviction: varchar("conviction", { length: 20 }).notNull(), // "VERY_STRONG", "STRONG", "MODERATE", "WEAK"
  allocation: double("allocation"), // Percentage of portfolio (0-100)
  
  // Entry/Exit levels
  entryZoneMin: double("entry_zone_min"),
  entryZoneMax: double("entry_zone_max"),
  stopLoss: double("stop_loss"),
  takeProfit1: double("take_profit_1"),
  takeProfit2: double("take_profit_2"),
  takeProfit3: double("take_profit_3"),
  
  // Prediction tracking
  predictedPriceChange: double("predicted_price_change"), // Expected % change
  predictionTimeframe: varchar("prediction_timeframe", { length: 10 }), // "1D", "7D", "30D"
  
  // Rationale
  reasoning: text("reasoning"),
  technicalSignals: text("technical_signals"), // JSON string of signals
  
  // Accuracy tracking (filled later)
  actualPriceChange: double("actual_price_change"),
  predictionAccurate: varchar("prediction_accurate", { length: 10 }), // "YES", "NO", "PENDING"
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyPriceLog = typeof dailyPriceLogs.$inferSelect;
export type InsertDailyPriceLog = typeof dailyPriceLogs.$inferInsert;

export type DailyRecommendation = typeof dailyRecommendations.$inferSelect;
export type InsertDailyRecommendation = typeof dailyRecommendations.$inferInsert;
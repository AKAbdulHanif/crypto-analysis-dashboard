# Project TODO

## Completed Features
- [x] Initial 12-token analysis with tier classification
- [x] Real-time price ticker with CoinGecko API integration
- [x] Unlock calendar widget with timeline visualization
- [x] Entry/exit trading levels for high-conviction positions
- [x] Full-stack upgrade with tRPC backend

## In Progress
- [x] Market dominance tracker (BTC.D, ETH.D, OTHERS.D, USDT.D, USDC.D)
- [x] ETHBTC pair tracking for altcoin rally signals
- [x] Real-time dominance charts and trend indicators
- [x] Altcoin season detection algorithm

## Future Enhancements
- [ ] Price alerts system with browser notifications
- [ ] Portfolio tracker with P&L calculations
- [ ] Historical price charts with TradingView integration

## Deployment
- [ ] Push code to GitHub repository for scheduled daily runs

## New Tasks
- [x] Add entry/exit price levels for all 12 tokens (not just 3 high-conviction)
- [x] Create GitHub repository and push code

## Nansen Integration
- [x] Integrate Nansen API for price verification and on-chain analytics
- [x] Add smart money flow tracking for each token
- [ ] Implement whale movement alerts

## Security
- [x] Remove hardcoded Nansen API key from code
- [x] Move API key to environment variables
- [x] Document security incident and key rotation procedure

## API Key Update
- [ ] Update NANSEN_API_KEY with validated key
- [ ] Test Nansen API integration with new key
- [ ] Verify Smart Money Analytics displays live data

## Nansen API Fix
- [x] Update request body to use correct format (per_page, filters, order_by)
- [x] Test with correct authentication header (apiKey)
- [ ] Verify Smart Money Analytics displays data (blocked by insufficient credits)

## Binance API Integration
- [ ] Add Binance API as fallback for price data
- [ ] Test Nansen API with new credits
- [ ] Verify all live data displays correctly

## New Token Additions
- [ ] Add ALEO, YEE, RAIL, TIBBIR to analysis
- [ ] Switch to Binance as primary price source
- [ ] Keep Nansen for smart money analytics only
- [ ] Update all token lists and mappings

## REST API Implementation
- [x] Create simple REST endpoints bypassing tRPC
- [x] Update frontend to use REST API instead of tRPC
- [x] Test all endpoints and verify data display - WORKING!

## Crash Fix & Testing
- [x] Fix map() error causing site crashes on published version
- [x] Add null/undefined checks to all array operations (added || [] fallbacks)
- [ ] Create integration tests for LivePriceTicker component
- [ ] Create integration tests for TradingLevels component
- [ ] Create smoke tests for page load and critical flows
- [x] Verify site loads without crashing

## Token Re-evaluation (Jan 4, 2026)
- [x] Gather current prices and 24h changes for all 12 tokens
- [x] Analyze volume trends and momentum shifts
- [x] Re-assess technical setups (HTF/LTF)
- [x] Update conviction levels based on new data
- [x] Recalculate optimal $50k allocation
- [x] Update website with revised recommendations

## Comprehensive Analysis Refresh (Jan 5, 2026)
- [x] Gather current macro conditions (Fed policy, inflation, risk sentiment)
- [x] Collect crypto market signals from news feeds and sentiment indicators
- [x] Analyze BTC.D (Bitcoin Dominance) current level and trend - 59.43%
- [x] Analyze OTHERS.D (Altcoin Dominance) for rotation signals - Confirmed rotation
- [x] Analyze TOTAL3 (Total Altcoin Market Cap) momentum - $879B, support at $784B
- [x] Identify altcoin rotation patterns and sector flows - Early rotation phase
- [x] Collect real-time price action and volume for all 12 tokens
- [x] Recalibrate entry zones based on support levels and volume profiles
- [x] Recalibrate exit targets based on resistance levels and Fibonacci extensions
- [x] Update stop-loss levels based on volatility and risk management
- [x] Refresh conviction levels and allocation recommendations
- [x] Update dashboard with all new data and analysis (created ANALYSIS_SUMMARY_JAN5.md)

## RAIL and YEE Token Research (Jan 5, 2026)
- [x] Gather basic data for RAIL (price, market cap, volume, contract address)
- [x] Gather basic data for YEE (price, market cap, volume, contract address)
- [x] Analyze RAIL on-chain metrics via Dune Analytics (no dashboards found)
- [x] Analyze YEE on-chain metrics via Dune Analytics (no dashboards found)
- [x] Check RAIL smart money activity via Nansen - HEAVY SELLING (-$29K netflow)
- [x] Check YEE smart money activity via Nansen - POSITIVE FLOW (+$41.5K netflow)
- [x] Evaluate RAIL vs existing portfolio tokens - AVOID (illiquid, distribution)
- [x] Evaluate YEE vs existing portfolio tokens - OPTIONAL micro position (2% max)
- [x] Update conviction rankings and allocations if warranted - NO CHANGES
- [x] Update dashboard with new tokens if they make the cut - NEITHER ADDED

## Daily Analysis Archive System (Jan 5, 2026)
- [x] Design database schema for daily_price_logs table
- [x] Design database schema for daily_recommendations table
- [x] Create Drizzle ORM schema files
- [x] Run database migrations (pnpm db:push)
- [x] Create API endpoint for logging daily prices
- [x] Create API endpoint for logging recommendations
- [x] Create API endpoint for retrieving historical data
- [x] Create API endpoint for prediction accuracy stats
- [x] Register archive router in main routers
- [x] Build HistoricalPerformance UI component
- [x] Build AccuracyMetrics UI component (integrated in HistoricalPerformance)
- [x] Implement automated daily logging script (server/scripts/log-daily-data.ts)
- [x] Test logging and retrieval functionality (logged 9 prices + 6 recommendations)
- [ ] Write vitest tests for archive system
- [x] Add HistoricalPerformance to Home page

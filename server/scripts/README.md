# Daily Analysis Archive Scripts

## Overview

This directory contains scripts for automated daily logging of crypto prices and trading recommendations.

## Scripts

### `log-daily-data.ts`

Logs current prices and recommendations to the database for historical tracking and prediction accuracy analysis.

**Usage:**
```bash
npx tsx server/scripts/log-daily-data.ts
```

**What it does:**
1. Fetches current prices from CoinMarketCap API for all tracked tokens
2. Logs price data to `daily_price_logs` table
3. Logs current recommendations to `daily_recommendations` table
4. Sets prediction accuracy status to "PENDING" for later verification

**Tokens tracked:**
- SUI, LINK, APT, SEI, ASTER, SONIC, PYTH, EIGEN, SYRUP, FARTCOIN, ALEO, TIBBIR

## Automation

### Manual Execution

Run the script manually whenever you want to log current data:

```bash
cd /home/ubuntu/crypto_analysis_2026
npx tsx server/scripts/log-daily-data.ts
```

### Scheduled Execution (Recommended)

Set up a cron job or use a task scheduler to run this script daily:

**Option 1: Using cron (Linux/Mac)**
```bash
# Edit crontab
crontab -e

# Add this line to run daily at 9 AM UTC
0 9 * * * cd /home/ubuntu/crypto_analysis_2026 && npx tsx server/scripts/log-daily-data.ts >> /home/ubuntu/crypto_analysis_2026/logs/daily-log.log 2>&1
```

**Option 2: Using GitHub Actions**
Create `.github/workflows/daily-log.yml`:
```yaml
name: Daily Crypto Data Logging

on:
  schedule:
    - cron: '0 9 * * *'  # 9 AM UTC daily
  workflow_dispatch:  # Allow manual trigger

jobs:
  log-data:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm install -g pnpm
      - run: pnpm install
      - run: npx tsx server/scripts/log-daily-data.ts
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}
```

**Option 3: Using Manus Schedule Tool**
```typescript
// In your task, use the schedule tool:
schedule({
  type: "cron",
  cron: "0 9 * * *",  // 9 AM UTC daily
  repeat: true,
  name: "Daily Crypto Data Logging",
  prompt: "Run the daily crypto data logging script at /home/ubuntu/crypto_analysis_2026/server/scripts/log-daily-data.ts to log current prices and recommendations to the database."
});
```

## Updating Recommendations

When your analysis changes, update the `CURRENT_RECOMMENDATIONS` array in `log-daily-data.ts`:

```typescript
const CURRENT_RECOMMENDATIONS = [
  {
    symbol: "SUI",
    action: "BUY",
    conviction: "VERY_STRONG",
    allocation: 50,
    // ... other fields
  },
  // Add more tokens as needed
];
```

## Prediction Accuracy Tracking

To update prediction accuracy after the timeframe expires:

1. Calculate actual price change
2. Use the `archive.updatePredictionAccuracy` API endpoint:

```typescript
await trpc.archive.updatePredictionAccuracy.mutate({
  id: recommendationId,
  actualPriceChange: 15.5,  // Actual % change
  predictionAccurate: "YES"  // or "NO"
});
```

## Viewing Historical Data

Access historical data through the UI:
- Visit the "Historical Performance & Prediction Accuracy" section on the homepage
- Select a token to view price history, recommendations, and accuracy stats
- Switch between 7D, 14D, 30D, and 90D views

## Database Schema

**daily_price_logs:**
- Stores daily price snapshots
- Includes BTC dominance, TOTAL3, and altcoin season index

**daily_recommendations:**
- Stores trading recommendations with entry/exit levels
- Tracks prediction accuracy over time
- Includes reasoning and technical signals

## Troubleshooting

**Issue: "Database not available"**
- Ensure `DATABASE_URL` environment variable is set
- Check database connection in `.env` file

**Issue: "No price data for [TOKEN]"**
- Token may not be in CoinMarketCap's top 200
- Check token symbol spelling
- Consider using a different API for that token

**Issue: Script fails silently**
- Check logs: `tail -f /home/ubuntu/crypto_analysis_2026/logs/daily-log.log`
- Run manually to see error messages
- Verify all dependencies are installed: `pnpm install`

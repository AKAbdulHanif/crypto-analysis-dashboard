import axios from 'axios';
import { publicProcedure, router } from './_core/trpc';
import { z } from 'zod';

const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

// Symbol mapping: our symbols to Binance trading pairs
const SYMBOL_MAPPING: Record<string, string> = {
  'SUI': 'SUIUSDT',
  'LINK': 'LINKUSDT',
  'APT': 'APTUSDT',
  'SEI': 'SEIUSDT',
  'PYTH': 'PYTHUSDT',
  'EIGEN': 'EIGENUSDT',
  'ASTER': 'ASTRUSDT',
  'SONIC': 'SONICUSDT',
  'SYRUP': 'SYRUPUSDT',
  'NIL': 'NILUSDT',
  'ALLO': 'ALLOUSDT',
  'FARTCOIN': 'FARTUSDT',
};

export const binanceRouter = router({
  getPrices: publicProcedure
    .input(z.object({
      symbols: z.array(z.string()).optional()
    }))
    .query(async ({ input }) => {
      try {
        const { symbols } = input;
        const tokensToFetch = symbols || Object.keys(SYMBOL_MAPPING);
        
        // Get 24h ticker data for all symbols
        const response = await axios.get(`${BINANCE_API_BASE}/ticker/24hr`, {
          timeout: 10000
        });

        const tickers = response.data;
        const results: any[] = [];

        tokensToFetch.forEach(symbol => {
          const binanceSymbol = SYMBOL_MAPPING[symbol];
          if (!binanceSymbol) return;

          const ticker = tickers.find((t: any) => t.symbol === binanceSymbol);
          if (ticker) {
            results.push({
              symbol,
              name: symbol,
              price: parseFloat(ticker.lastPrice),
              change24h: parseFloat(ticker.priceChangePercent),
              volume24h: parseFloat(ticker.volume) * parseFloat(ticker.lastPrice),
              high24h: parseFloat(ticker.highPrice),
              low24h: parseFloat(ticker.lowPrice),
              source: 'binance'
            });
          }
        });

        return {
          success: true,
          data: results,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error fetching Binance prices:', error);
        return {
          success: false,
          data: [],
          error: error instanceof Error ? error.message : 'Failed to fetch prices'
        };
      }
    })
});

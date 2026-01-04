import axios from 'axios';
import { publicProcedure, router } from './_core/trpc';
import { z } from 'zod';

const CMC_API_BASE = 'https://api.coinmarketcap.com/data-api/v3';

// Symbol to CMC slug mapping
const SYMBOL_TO_SLUG: Record<string, string> = {
  'SUI': 'sui',
  'LINK': 'chainlink',
  'APT': 'aptos',
  'SEI': 'sei-network',
  'PYTH': 'pyth-network',
  'EIGEN': 'eigenlayer',
  'ASTER': 'astar',
  'SONIC': 'sonic',
  'SYRUP': 'maple',
  'NIL': 'nillion',
  'ALLO': 'allora',
  'FARTCOIN': 'fartcoin',
  'ALEO': 'aleo',
  'YEE': 'yee',
  'RAIL': 'railgun',
  'TIBBIR': 'tibbir'
};

export const coinmarketcapRouter = router({
  getPrices: publicProcedure
    .input(z.object({
      symbols: z.array(z.string()).optional()
    }))
    .query(async ({ input }) => {
      try {
        const symbolsToFetch = input.symbols || Object.keys(SYMBOL_TO_SLUG);
        
        // Fetch top 500 coins (covers most tokens)
        const response = await axios.get(
          `${CMC_API_BASE}/cryptocurrency/listing`,
          {
            params: {
              start: 1,
              limit: 500,
              sortBy: 'market_cap',
              sortType: 'desc',
              convert: 'USD'
            },
            timeout: 15000
          }
        );

        const coins = response.data.data.cryptoCurrencyList;
        const results: any[] = [];

        symbolsToFetch.forEach(symbol => {
          const slug = SYMBOL_TO_SLUG[symbol];
          if (!slug) return;

          const coin = coins.find((c: any) => 
            c.slug === slug || c.symbol === symbol
          );

          if (coin) {
            const quote = coin.quotes?.[0] || {};
            results.push({
              symbol,
              name: coin.name,
              price: quote.price || 0,
              change24h: quote.percentChange24h || 0,
              change7d: quote.percentChange7d || 0,
              change30d: quote.percentChange30d || 0,
              volume24h: quote.volume24h || 0,
              marketCap: quote.marketCap || 0,
              lastUpdated: new Date().toISOString(),
              source: 'coinmarketcap'
            });
          }
        });

        return {
          success: true,
          data: results,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error fetching CoinMarketCap prices:', error);
        return {
          success: false,
          data: [],
          error: error instanceof Error ? error.message : 'Failed to fetch prices',
          timestamp: new Date().toISOString()
        };
      }
    })
});

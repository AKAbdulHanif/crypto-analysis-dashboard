import axios from 'axios';
import { publicProcedure, router } from './_core/trpc';
import { z } from 'zod';

const CMC_API_BASE = 'https://api.coinmarketcap.com/data-api/v3';

// Map our token symbols to CMC slugs
const TOKEN_SLUG_MAP: Record<string, string> = {
  'SUI': 'sui',
  'LINK': 'chainlink',
  'APT': 'aptos',
  'SEI': 'sei-network',
  'ASTER': 'astar',
  'SONIC': 'sonic',
  'PYTH': 'pyth-network',
  'EIGEN': 'eigenlayer',
  'SYRUP': 'maple',
  'NIL': 'nillion',
  'ALLO': 'allora',
  'FARTCOIN': 'fartcoin',
  'ALEO': 'aleo',
  'YEE': 'yee',
  'RAIL': 'railgun',
  'TIBBIR': 'tibbir'
};

export const cryptoRouter = router({
  getDominance: publicProcedure
    .query(async () => {
      try {
        // Fetch top coins for dominance calculation
        const response = await axios.get(
          `${CMC_API_BASE}/cryptocurrency/listing`,
          {
            params: {
              start: 1,
              limit: 100,
              sortBy: 'market_cap',
              sortType: 'desc',
              convert: 'USD'
            },
            timeout: 15000
          }
        );

        const coins = response.data.data.cryptoCurrencyList;
        
        // Calculate total market cap
        const totalMarketCap = coins.reduce((sum: number, coin: any) => {
          const quote = coin.quotes?.[0] || {};
          return sum + (quote.marketCap || 0);
        }, 0);

        // Find BTC, ETH, USDT, USDC
        const btc = coins.find((c: any) => c.symbol === 'BTC');
        const eth = coins.find((c: any) => c.symbol === 'ETH');
        const usdt = coins.find((c: any) => c.symbol === 'USDT');
        const usdc = coins.find((c: any) => c.symbol === 'USDC');

        const btcMarketCap = btc?.quotes?.[0]?.marketCap || 0;
        const ethMarketCap = eth?.quotes?.[0]?.marketCap || 0;
        const usdtMarketCap = usdt?.quotes?.[0]?.marketCap || 0;
        const usdcMarketCap = usdc?.quotes?.[0]?.marketCap || 0;

        const btcDominance = (btcMarketCap / totalMarketCap) * 100;
        const ethDominance = (ethMarketCap / totalMarketCap) * 100;
        const othersDominance = 100 - btcDominance - ethDominance;
        const usdtDominance = (usdtMarketCap / totalMarketCap) * 100;
        const usdcDominance = (usdcMarketCap / totalMarketCap) * 100;

        // Calculate ETHBTC ratio
        const ethPrice = eth?.quotes?.[0]?.price || 0;
        const btcPrice = btc?.quotes?.[0]?.price || 0;
        const ethbtcRatio = ethPrice / btcPrice;
        const ethbtcChange24h = (eth?.quotes?.[0]?.percentChange24h || 0) - (btc?.quotes?.[0]?.percentChange24h || 0);

        return {
          success: true,
          data: {
            btcDominance: {
              value: btcDominance,
              change24h: 0,
              trend: 'neutral' as const
            },
            ethDominance: {
              value: ethDominance,
              change24h: 0,
              trend: 'neutral' as const
            },
            othersDominance: {
              value: othersDominance,
              change24h: 0,
              trend: 'neutral' as const
            },
            usdtDominance: {
              value: usdtDominance,
              change24h: 0,
              trend: 'neutral' as const
            },
            usdcDominance: {
              value: usdcDominance,
              change24h: 0,
              trend: 'neutral' as const
            },
            ethbtc: {
              value: ethbtcRatio,
              change24h: ethbtcChange24h,
              change7d: 0,
              trend: ethbtcChange24h >= 0 ? 'up' as const : 'down' as const
            },
            altcoinSeasonSignal: {
              isAltSeason: othersDominance > 40 && btcDominance < 45,
              strength: othersDominance > 45 ? 'strong' : othersDominance > 40 ? 'moderate' : 'weak',
              indicators: {
                btcDominanceFalling: btcDominance < 50,
                othersDominanceRising: othersDominance > 40,
                ethbtcRising: ethbtcChange24h > 0,
                stablecoinDominanceFalling: (usdtDominance + usdcDominance) < 10
              }
            },
            totalMarketCap,
            lastUpdated: new Date().toISOString()
          },
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error fetching dominance data:', error);
        return {
          success: false,
          data: null,
          error: error instanceof Error ? error.message : 'Failed to fetch dominance data',
          timestamp: new Date().toISOString()
        };
      }
    }),

  getPrices: publicProcedure
    .input(z.object({
      symbols: z.array(z.string()).optional()
    }))
    .query(async ({ input }) => {
      try {
        const symbolsToFetch = input.symbols || Object.keys(TOKEN_SLUG_MAP);
        
        // Fetch top 500 coins from CoinMarketCap
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
          const slug = TOKEN_SLUG_MAP[symbol];
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
              marketCap: quote.marketCap || 0,
              volume24h: quote.volume24h || 0,
              change24h: quote.percentChange24h || 0,
              change7d: quote.percentChange7d || 0,
              change30d: quote.percentChange30d || 0,
              lastUpdated: new Date().toISOString()
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
    }),

  getTokenDetails: publicProcedure
    .input(z.object({
      symbol: z.string()
    }))
    .query(async ({ input }) => {
      try {
        const coinSlug = TOKEN_SLUG_MAP[input.symbol];
        if (!coinSlug) {
          throw new Error(`Token ${input.symbol} not found`);
        }

        // CoinMarketCap public API doesn't have detailed endpoint
        // Return basic info from listing
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
        const coin = coins.find((c: any) => c.slug === coinSlug || c.symbol === input.symbol);

        if (!coin) {
          throw new Error(`Token ${input.symbol} not found in listings`);
        }

        const quote = coin.quotes?.[0] || {};

        return {
          success: true,
          data: {
            symbol: input.symbol,
            name: coin.name,
            price: quote.price || 0,
            marketCap: quote.marketCap || 0,
            volume24h: quote.volume24h || 0,
            circulatingSupply: coin.circulatingSupply || 0,
            totalSupply: coin.totalSupply || 0,
            maxSupply: coin.maxSupply || 0,
            change24h: quote.percentChange24h || 0,
            change7d: quote.percentChange7d || 0,
            change30d: quote.percentChange30d || 0,
            lastUpdated: new Date().toISOString()
          }
        };
      } catch (error) {
        console.error('Error fetching token details:', error);
        return {
          success: false,
          data: null,
          error: error instanceof Error ? error.message : 'Failed to fetch token details'
        };
      }
    })
});

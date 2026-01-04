import axios from 'axios';
import { publicProcedure, router } from './_core/trpc';
import { z } from 'zod';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Map our token symbols to CoinGecko IDs
const TOKEN_ID_MAP: Record<string, string> = {
  'SUI': 'sui',
  'LINK': 'chainlink',
  'APT': 'aptos',
  'SEI': 'sei-network',
  'ASTER': 'astar',
  'SONIC': 'sonic-sfs',
  'PYTH': 'pyth-network',
  'EIGEN': 'eigenlayer',
  'SYRUP': 'maple',
  'NIL': 'nillion',
  'ALLO': 'allora',
  'FARTCOIN': 'fartcoin'
};

interface CoinGeckoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_30d_in_currency?: number;
}

export const cryptoRouter = router({
  getPrices: publicProcedure
    .input(z.object({
      symbols: z.array(z.string()).optional()
    }))
    .query(async ({ input }) => {
      try {
        const symbolsToFetch = input.symbols || Object.keys(TOKEN_ID_MAP);
        const coinGeckoIds = symbolsToFetch
          .map(symbol => TOKEN_ID_MAP[symbol])
          .filter(Boolean)
          .join(',');

        const response = await axios.get<CoinGeckoPrice[]>(
          `${COINGECKO_API_BASE}/coins/markets`,
          {
            params: {
              vs_currency: 'usd',
              ids: coinGeckoIds,
              order: 'market_cap_desc',
              per_page: 100,
              page: 1,
              sparkline: false,
              price_change_percentage: '24h,7d,30d'
            },
            timeout: 10000
          }
        );

        // Transform to our format
        const priceData = response.data.map(coin => {
          const symbol = Object.keys(TOKEN_ID_MAP).find(
            key => TOKEN_ID_MAP[key] === coin.id
          ) || coin.symbol.toUpperCase();

          return {
            symbol,
            name: coin.name,
            price: coin.current_price,
            marketCap: coin.market_cap,
            volume24h: coin.total_volume,
            change24h: coin.price_change_percentage_24h || 0,
            change7d: coin.price_change_percentage_7d_in_currency || 0,
            change30d: coin.price_change_percentage_30d_in_currency || 0,
            lastUpdated: new Date().toISOString()
          };
        });

        return {
          success: true,
          data: priceData,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
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
        const coinGeckoId = TOKEN_ID_MAP[input.symbol];
        if (!coinGeckoId) {
          throw new Error(`Token ${input.symbol} not found`);
        }

        const response = await axios.get(
          `${COINGECKO_API_BASE}/coins/${coinGeckoId}`,
          {
            params: {
              localization: false,
              tickers: false,
              market_data: true,
              community_data: false,
              developer_data: false
            },
            timeout: 10000
          }
        );

        const coin = response.data;
        const marketData = coin.market_data;

        return {
          success: true,
          data: {
            symbol: input.symbol,
            name: coin.name,
            price: marketData.current_price.usd,
            marketCap: marketData.market_cap.usd,
            volume24h: marketData.total_volume.usd,
            circulatingSupply: marketData.circulating_supply,
            totalSupply: marketData.total_supply,
            maxSupply: marketData.max_supply,
            change24h: marketData.price_change_percentage_24h || 0,
            change7d: marketData.price_change_percentage_7d || 0,
            change30d: marketData.price_change_percentage_30d || 0,
            ath: marketData.ath.usd,
            athDate: marketData.ath_date.usd,
            atl: marketData.atl.usd,
            atlDate: marketData.atl_date.usd,
            lastUpdated: coin.last_updated
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

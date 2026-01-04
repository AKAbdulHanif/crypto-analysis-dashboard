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
  getDominance: publicProcedure
    .query(async () => {
      try {
        // Fetch global crypto data for dominance metrics
        const globalResponse = await axios.get(
          `${COINGECKO_API_BASE}/global`,
          { timeout: 10000 }
        );

        const globalData = globalResponse.data.data;
        const marketCapPercentages = globalData.market_cap_percentage;

        // Calculate OTHERS.D (100 - BTC.D - ETH.D)
        const btcDominance = marketCapPercentages.btc || 0;
        const ethDominance = marketCapPercentages.eth || 0;
        const othersDominance = 100 - btcDominance - ethDominance;

        // Fetch USDT and USDC market caps for stablecoin dominance
        const stablecoinsResponse = await axios.get<CoinGeckoPrice[]>(
          `${COINGECKO_API_BASE}/coins/markets`,
          {
            params: {
              vs_currency: 'usd',
              ids: 'tether,usd-coin',
              order: 'market_cap_desc',
              per_page: 2,
              page: 1,
              sparkline: false
            },
            timeout: 10000
          }
        );

        const totalMarketCap = globalData.total_market_cap.usd;
        const usdtMarketCap = stablecoinsResponse.data.find(c => c.id === 'tether')?.market_cap || 0;
        const usdcMarketCap = stablecoinsResponse.data.find(c => c.id === 'usd-coin')?.market_cap || 0;

        const usdtDominance = (usdtMarketCap / totalMarketCap) * 100;
        const usdcDominance = (usdcMarketCap / totalMarketCap) * 100;

        // Fetch ETHBTC pair data
        const ethbtcResponse = await axios.get(
          `${COINGECKO_API_BASE}/simple/price`,
          {
            params: {
              ids: 'ethereum',
              vs_currencies: 'btc',
              include_24hr_change: true,
              include_7d_change: true
            },
            timeout: 10000
          }
        );

        const ethbtcData = ethbtcResponse.data.ethereum;

        return {
          success: true,
          data: {
            btcDominance: {
              value: btcDominance,
              change24h: 0, // CoinGecko doesn't provide 24h change for dominance
              trend: 'neutral' as 'up' | 'down' | 'neutral'
            },
            ethDominance: {
              value: ethDominance,
              change24h: 0,
              trend: 'neutral' as 'up' | 'down' | 'neutral'
            },
            othersDominance: {
              value: othersDominance,
              change24h: 0,
              trend: 'neutral' as 'up' | 'down' | 'neutral'
            },
            usdtDominance: {
              value: usdtDominance,
              change24h: 0,
              trend: 'neutral' as 'up' | 'down' | 'neutral'
            },
            usdcDominance: {
              value: usdcDominance,
              change24h: 0,
              trend: 'neutral' as 'up' | 'down' | 'neutral'
            },
            ethbtc: {
              value: ethbtcData.btc,
              change24h: ethbtcData.btc_24h_change || 0,
              change7d: ethbtcData.btc_7d_change || 0,
              trend: (ethbtcData.btc_24h_change || 0) >= 0 ? 'up' as const : 'down' as const
            },
            altcoinSeasonSignal: {
              isAltSeason: othersDominance > 40 && btcDominance < 45,
              strength: othersDominance > 45 ? 'strong' : othersDominance > 40 ? 'moderate' : 'weak',
              indicators: {
                btcDominanceFalling: btcDominance < 50,
                othersDominanceRising: othersDominance > 40,
                ethbtcRising: (ethbtcData.btc_24h_change || 0) > 0,
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

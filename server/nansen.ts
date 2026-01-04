import axios from 'axios';
import { publicProcedure, router } from './_core/trpc';
import { z } from 'zod';

const NANSEN_API_KEY = process.env.NANSEN_API_KEY || '';
const NANSEN_API_BASE = 'https://api.nansen.ai/api/v1';

// Token symbol to contract address mapping for major chains
const TOKEN_ADDRESSES: Record<string, { chain: string; address: string }> = {
  'SUI': { chain: 'sui', address: '0x2::sui::SUI' },
  'LINK': { chain: 'ethereum', address: '0x514910771af9ca656af840dff83e8264ecf986ca' },
  'APT': { chain: 'aptos', address: '0x1::aptos_coin::AptosCoin' },
  'SEI': { chain: 'sei', address: 'usei' },
  'PYTH': { chain: 'solana', address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3' },
  'EIGEN': { chain: 'ethereum', address: '0xec53bf9167f50cdeb3ae105f56099aaab9061f83' },
  // Add more as needed
};

interface NansenTokenData {
  token_address: string;
  chain: string;
  symbol: string;
  name: string;
  price: number;
  price_change_24h: number;
  volume_24h: number;
  market_cap: number;
  liquidity: number;
  smart_money_holders: number;
  fresh_wallets_24h: number;
  buy_volume_24h: number;
  sell_volume_24h: number;
  holder_count: number;
}

export const nansenRouter = router({
  getTokenData: publicProcedure
    .input(z.object({
      symbols: z.array(z.string()).optional()
    }))
    .query(async ({ input }) => {
      try {
        const { symbols } = input;
        
        // If no symbols provided, use all available tokens
        const tokensToFetch = symbols || Object.keys(TOKEN_ADDRESSES);
        
        // Group tokens by chain for efficient API calls
        const chainGroups: Record<string, string[]> = {};
        tokensToFetch.forEach(symbol => {
          const tokenInfo = TOKEN_ADDRESSES[symbol];
          if (tokenInfo) {
            if (!chainGroups[tokenInfo.chain]) {
              chainGroups[tokenInfo.chain] = [];
            }
            chainGroups[tokenInfo.chain].push(symbol);
          }
        });

        const results: any[] = [];

        // Fetch data for each chain
        for (const [chain, chainSymbols] of Object.entries(chainGroups)) {
          try {
            const response = await axios.post(
              `${NANSEN_API_BASE}/token-screener`,
              {
                chains: [chain],
                timeframe: '24h',
                pagination: {
                  page: 1,
                  page_size: 100
                }
              },
              {
                headers: {
                  'X-API-KEY': NANSEN_API_KEY,
                  'Content-Type': 'application/json'
                },
                timeout: 15000
              }
            );

            if (response.data && response.data.data) {
              const tokens = response.data.data;
              
              // Match tokens by symbol
              chainSymbols.forEach(symbol => {
                const tokenInfo = TOKEN_ADDRESSES[symbol];
                const tokenData = tokens.find((t: any) => 
                  t.token_address.toLowerCase() === tokenInfo.address.toLowerCase() ||
                  t.symbol?.toUpperCase() === symbol
                );

                if (tokenData) {
                  results.push({
                    symbol,
                    name: tokenData.name || symbol,
                    chain: tokenInfo.chain,
                    price: tokenData.price || 0,
                    priceChange24h: tokenData.price_change_24h || 0,
                    volume24h: tokenData.volume_24h || 0,
                    marketCap: tokenData.market_cap || 0,
                    liquidity: tokenData.liquidity || 0,
                    smartMoneyHolders: tokenData.smart_money_holders || 0,
                    freshWallets24h: tokenData.fresh_wallets_24h || 0,
                    buyVolume24h: tokenData.buy_volume_24h || 0,
                    sellVolume24h: tokenData.sell_volume_24h || 0,
                    holderCount: tokenData.holder_count || 0,
                    buyPressure: tokenData.buy_volume_24h && tokenData.sell_volume_24h
                      ? ((tokenData.buy_volume_24h / (tokenData.buy_volume_24h + tokenData.sell_volume_24h)) * 100).toFixed(2)
                      : '50.00',
                    smartMoneySignal: tokenData.smart_money_holders > 10 ? 'bullish' : 
                                     tokenData.smart_money_holders > 5 ? 'neutral' : 'bearish'
                  });
                }
              });
            }
          } catch (chainError) {
            console.error(`Error fetching Nansen data for chain ${chain}:`, chainError);
            // Continue with other chains even if one fails
          }
        }

        return {
          success: true,
          data: results,
          timestamp: new Date().toISOString(),
          source: 'nansen'
        };
      } catch (error) {
        console.error('Error fetching Nansen token data:', error);
        return {
          success: false,
          data: [],
          error: error instanceof Error ? error.message : 'Failed to fetch Nansen data',
          timestamp: new Date().toISOString(),
          source: 'nansen'
        };
      }
    }),

  getSmartMoneyActivity: publicProcedure
    .input(z.object({
      symbol: z.string()
    }))
    .query(async ({ input }) => {
      try {
        const { symbol } = input;
        const tokenInfo = TOKEN_ADDRESSES[symbol];

        if (!tokenInfo) {
          return {
            success: false,
            data: null,
            error: `Token ${symbol} not supported for smart money tracking`
          };
        }

        // Fetch detailed smart money activity
        const response = await axios.post(
          `${NANSEN_API_BASE}/token-screener`,
          {
            chains: [tokenInfo.chain],
            timeframe: '7d',
            filters: {
              only_smart_money: true
            },
            pagination: {
              page: 1,
              page_size: 50
            }
          },
          {
            headers: {
              'X-API-KEY': NANSEN_API_KEY,
              'Content-Type': 'application/json'
            },
            timeout: 15000
          }
        );

        const tokens = response.data?.data || [];
        const tokenData = tokens.find((t: any) => 
          t.token_address.toLowerCase() === tokenInfo.address.toLowerCase() ||
          t.symbol?.toUpperCase() === symbol
        );

        if (!tokenData) {
          return {
            success: false,
            data: null,
            error: `No smart money data found for ${symbol}`
          };
        }

        return {
          success: true,
          data: {
            symbol,
            smartMoneyHolders: tokenData.smart_money_holders || 0,
            smartMoneyBuyVolume: tokenData.smart_money_buy_volume || 0,
            smartMoneySellVolume: tokenData.smart_money_sell_volume || 0,
            netSmartMoneyFlow: (tokenData.smart_money_buy_volume || 0) - (tokenData.smart_money_sell_volume || 0),
            freshWallets7d: tokenData.fresh_wallets_7d || 0,
            signal: (tokenData.smart_money_buy_volume || 0) > (tokenData.smart_money_sell_volume || 0) 
              ? 'accumulation' 
              : 'distribution',
            confidence: tokenData.smart_money_holders > 20 ? 'high' : 
                       tokenData.smart_money_holders > 10 ? 'medium' : 'low'
          },
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error fetching smart money activity:', error);
        return {
          success: false,
          data: null,
          error: error instanceof Error ? error.message : 'Failed to fetch smart money data'
        };
      }
    })
});

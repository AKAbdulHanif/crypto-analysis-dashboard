import { Router } from 'express';
import axios from 'axios';

const router = Router();

const CMC_API_BASE = 'https://api.coinmarketcap.com/data-api/v3';
const NANSEN_API_KEY = process.env.NANSEN_API_KEY || '';

// Token mappings
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

// GET /api/prices - Get crypto prices
router.get('/prices', async (req, res) => {
  try {
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

    Object.keys(TOKEN_SLUG_MAP).forEach(symbol => {
      const slug = TOKEN_SLUG_MAP[symbol];
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

    res.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Failed to fetch prices'
    });
  }
});

// GET /api/dominance - Get market dominance data
router.get('/dominance', async (req, res) => {
  try {
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
    
    const totalMarketCap = coins.reduce((sum: number, coin: any) => {
      const quote = coin.quotes?.[0] || {};
      return sum + (quote.marketCap || 0);
    }, 0);

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

    const ethPrice = eth?.quotes?.[0]?.price || 0;
    const btcPrice = btc?.quotes?.[0]?.price || 0;
    const ethbtcRatio = ethPrice / btcPrice;
    const ethbtcChange24h = (eth?.quotes?.[0]?.percentChange24h || 0) - (btc?.quotes?.[0]?.percentChange24h || 0);

    res.json({
      success: true,
      data: {
        btcDominance: {
          value: btcDominance,
          change24h: 0,
          trend: 'neutral'
        },
        ethDominance: {
          value: ethDominance,
          change24h: 0,
          trend: 'neutral'
        },
        othersDominance: {
          value: othersDominance,
          change24h: 0,
          trend: 'neutral'
        },
        usdtDominance: {
          value: usdtDominance,
          change24h: 0,
          trend: 'neutral'
        },
        usdcDominance: {
          value: usdcDominance,
          change24h: 0,
          trend: 'neutral'
        },
        ethbtc: {
          value: ethbtcRatio,
          change24h: ethbtcChange24h,
          change7d: 0,
          trend: ethbtcChange24h >= 0 ? 'up' : 'down'
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
    });
  } catch (error) {
    console.error('Error fetching dominance:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch dominance data'
    });
  }
});

// GET /api/nansen - Get Nansen smart money data
router.get('/nansen', async (req, res) => {
  try {
    if (!NANSEN_API_KEY) {
      throw new Error('Nansen API key not configured');
    }

    const response = await axios.post(
      'https://api.nansen.ai/api/v1/token-screener',
      {
        chains: ['ethereum', 'solana'],
        timeframe: '24h',
        pagination: { page: 1, per_page: 50 },
        filters: { only_smart_money: false },
        order_by: [{ field: 'volume', direction: 'DESC' }]
      },
      {
        headers: {
          'apiKey': NANSEN_API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    res.json({
      success: true,
      data: response.data.data || [],
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error fetching Nansen data:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      data: [],
      error: error.response?.data?.message || error.message || 'Failed to fetch Nansen data'
    });
  }
});

export default router;

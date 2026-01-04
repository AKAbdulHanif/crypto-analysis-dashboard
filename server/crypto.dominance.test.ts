import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

function createTestContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("crypto.getDominance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and calculates market dominance data successfully", async () => {
    const mockGlobalResponse = {
      data: {
        data: {
          market_cap_percentage: {
            btc: 48.5,
            eth: 18.2
          },
          total_market_cap: {
            usd: 3000000000000
          }
        }
      }
    };

    const mockStablecoinsResponse = {
      data: [
        {
          id: 'tether',
          symbol: 'usdt',
          name: 'Tether',
          market_cap: 120000000000
        },
        {
          id: 'usd-coin',
          symbol: 'usdc',
          name: 'USD Coin',
          market_cap: 40000000000
        }
      ]
    };

    const mockEthBtcResponse = {
      data: {
        ethereum: {
          btc: 0.0375,
          btc_24h_change: 2.5,
          btc_7d_change: 5.2
        }
      }
    };

    mockedAxios.get
      .mockResolvedValueOnce(mockGlobalResponse)
      .mockResolvedValueOnce(mockStablecoinsResponse)
      .mockResolvedValueOnce(mockEthBtcResponse);

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crypto.getDominance();

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.btcDominance.value).toBe(48.5);
    expect(result.data?.ethDominance.value).toBe(18.2);
    expect(result.data?.othersDominance.value).toBeCloseTo(33.3, 1);
    expect(result.data?.ethbtc.value).toBe(0.0375);
    expect(result.data?.ethbtc.change24h).toBe(2.5);
  });

  it("detects altcoin season correctly", async () => {
    const mockGlobalResponse = {
      data: {
        data: {
          market_cap_percentage: {
            btc: 42.0,
            eth: 16.0
          },
          total_market_cap: {
            usd: 3000000000000
          }
        }
      }
    };

    const mockStablecoinsResponse = {
      data: [
        { id: 'tether', market_cap: 100000000000 },
        { id: 'usd-coin', market_cap: 30000000000 }
      ]
    };

    const mockEthBtcResponse = {
      data: {
        ethereum: {
          btc: 0.038,
          btc_24h_change: 3.2,
          btc_7d_change: 6.5
        }
      }
    };

    mockedAxios.get
      .mockResolvedValueOnce(mockGlobalResponse)
      .mockResolvedValueOnce(mockStablecoinsResponse)
      .mockResolvedValueOnce(mockEthBtcResponse);

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crypto.getDominance();

    expect(result.success).toBe(true);
    expect(result.data?.othersDominance.value).toBe(42.0);
    expect(result.data?.altcoinSeasonSignal.isAltSeason).toBe(true);
    expect(result.data?.altcoinSeasonSignal.strength).toBe('moderate');
    expect(result.data?.altcoinSeasonSignal.indicators.btcDominanceFalling).toBe(true);
    expect(result.data?.altcoinSeasonSignal.indicators.othersDominanceRising).toBe(true);
  });

  it("detects strong altcoin season", async () => {
    const mockGlobalResponse = {
      data: {
        data: {
          market_cap_percentage: {
            btc: 40.0,
            eth: 14.0
          },
          total_market_cap: {
            usd: 3000000000000
          }
        }
      }
    };

    const mockStablecoinsResponse = {
      data: [
        { id: 'tether', market_cap: 100000000000 },
        { id: 'usd-coin', market_cap: 30000000000 }
      ]
    };

    const mockEthBtcResponse = {
      data: {
        ethereum: {
          btc: 0.04,
          btc_24h_change: 4.5,
          btc_7d_change: 8.2
        }
      }
    };

    mockedAxios.get
      .mockResolvedValueOnce(mockGlobalResponse)
      .mockResolvedValueOnce(mockStablecoinsResponse)
      .mockResolvedValueOnce(mockEthBtcResponse);

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crypto.getDominance();

    expect(result.success).toBe(true);
    expect(result.data?.othersDominance.value).toBe(46.0);
    expect(result.data?.altcoinSeasonSignal.isAltSeason).toBe(true);
    expect(result.data?.altcoinSeasonSignal.strength).toBe('strong');
  });

  it("handles API errors gracefully", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API rate limit exceeded'));

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crypto.getDominance();

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toBeDefined();
  });

  it("calculates stablecoin dominance correctly", async () => {
    const mockGlobalResponse = {
      data: {
        data: {
          market_cap_percentage: {
            btc: 50.0,
            eth: 20.0
          },
          total_market_cap: {
            usd: 2000000000000
          }
        }
      }
    };

    const mockStablecoinsResponse = {
      data: [
        { id: 'tether', market_cap: 120000000000 },
        { id: 'usd-coin', market_cap: 40000000000 }
      ]
    };

    const mockEthBtcResponse = {
      data: {
        ethereum: {
          btc: 0.037,
          btc_24h_change: 1.5,
          btc_7d_change: 3.2
        }
      }
    };

    mockedAxios.get
      .mockResolvedValueOnce(mockGlobalResponse)
      .mockResolvedValueOnce(mockStablecoinsResponse)
      .mockResolvedValueOnce(mockEthBtcResponse);

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crypto.getDominance();

    expect(result.success).toBe(true);
    const usdtDom = result.data?.usdtDominance.value || 0;
    const usdcDom = result.data?.usdcDominance.value || 0;
    const totalStableDom = usdtDom + usdcDom;
    
    expect(totalStableDom).toBeCloseTo(8.0, 1); // (160B / 2000B) * 100 = 8%
  });
});

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

describe("nansen.getTokenData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches token data from Nansen API successfully", async () => {
    const mockNansenResponse = {
      data: {
        data: [
          {
            token_address: '0x514910771af9ca656af840dff83e8264ecf986ca',
            chain: 'ethereum',
            symbol: 'LINK',
            name: 'Chainlink',
            price: 13.45,
            price_change_24h: 2.5,
            volume_24h: 750000000,
            market_cap: 9500000000,
            liquidity: 250000000,
            smart_money_holders: 15,
            fresh_wallets_24h: 234,
            buy_volume_24h: 450000000,
            sell_volume_24h: 300000000,
            holder_count: 125000
          }
        ]
      }
    };

    mockedAxios.post.mockResolvedValueOnce(mockNansenResponse);

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.nansen.getTokenData({ symbols: ['LINK'] });

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data.length).toBe(1);
    expect(result.data[0].symbol).toBe('LINK');
    expect(result.data[0].price).toBe(13.45);
    expect(result.data[0].smartMoneyHolders).toBe(15);
    expect(result.data[0].buyPressure).toBe('60.00'); // 450M / 750M = 60%
    expect(result.source).toBe('nansen');
  });

  it("calculates buy pressure correctly", async () => {
    const mockNansenResponse = {
      data: {
        data: [
          {
            token_address: '0x2::sui::SUI',
            chain: 'sui',
            symbol: 'SUI',
            name: 'Sui Network',
            price: 1.68,
            price_change_24h: 3.2,
            volume_24h: 1600000000,
            market_cap: 6400000000,
            liquidity: 500000000,
            smart_money_holders: 25,
            fresh_wallets_24h: 456,
            buy_volume_24h: 1200000000,
            sell_volume_24h: 400000000,
            holder_count: 250000
          }
        ]
      }
    };

    mockedAxios.post.mockResolvedValueOnce(mockNansenResponse);

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.nansen.getTokenData({ symbols: ['SUI'] });

    expect(result.success).toBe(true);
    expect(result.data[0].buyPressure).toBe('75.00'); // 1200M / 1600M = 75%
    expect(result.data[0].smartMoneySignal).toBe('bullish'); // >10 holders
  });

  it("determines smart money signal correctly", async () => {
    const mockResponses = [
      {
        data: {
          data: [{
            token_address: '0x1',
            symbol: 'TOKEN1',
            smart_money_holders: 25,
            buy_volume_24h: 100,
            sell_volume_24h: 50
          }]
        }
      },
      {
        data: {
          data: [{
            token_address: '0x2',
            symbol: 'TOKEN2',
            smart_money_holders: 7,
            buy_volume_24h: 100,
            sell_volume_24h: 50
          }]
        }
      },
      {
        data: {
          data: [{
            token_address: '0x3',
            symbol: 'TOKEN3',
            smart_money_holders: 3,
            buy_volume_24h: 100,
            sell_volume_24h: 50
          }]
        }
      }
    ];

    for (const mockResponse of mockResponses) {
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
    }

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Test bullish signal (>10 holders)
    const result1 = await caller.nansen.getTokenData({ symbols: ['TOKEN1'] });
    expect(result1.data[0]?.smartMoneySignal).toBe('bullish');

    // Test neutral signal (5-10 holders)
    const result2 = await caller.nansen.getTokenData({ symbols: ['TOKEN2'] });
    expect(result2.data[0]?.smartMoneySignal).toBe('neutral');

    // Test bearish signal (<5 holders)
    const result3 = await caller.nansen.getTokenData({ symbols: ['TOKEN3'] });
    expect(result3.data[0]?.smartMoneySignal).toBe('bearish');
  });

  it("handles API errors gracefully", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Nansen API rate limit exceeded'));

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.nansen.getTokenData({ symbols: ['LINK'] });

    expect(result.success).toBe(false);
    expect(result.data).toEqual([]);
    expect(result.error).toBeDefined();
  });

  it("handles multiple tokens across different chains", async () => {
    const mockEthResponse = {
      data: {
        data: [
          {
            token_address: '0x514910771af9ca656af840dff83e8264ecf986ca',
            symbol: 'LINK',
            name: 'Chainlink',
            price: 13.45,
            smart_money_holders: 15,
            buy_volume_24h: 450000000,
            sell_volume_24h: 300000000
          }
        ]
      }
    };

    const mockSuiResponse = {
      data: {
        data: [
          {
            token_address: '0x2::sui::SUI',
            symbol: 'SUI',
            name: 'Sui Network',
            price: 1.68,
            smart_money_holders: 25,
            buy_volume_24h: 1200000000,
            sell_volume_24h: 400000000
          }
        ]
      }
    };

    mockedAxios.post
      .mockResolvedValueOnce(mockEthResponse)
      .mockResolvedValueOnce(mockSuiResponse);

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.nansen.getTokenData({ symbols: ['LINK', 'SUI'] });

    expect(result.success).toBe(true);
    expect(result.data.length).toBe(2);
    expect(result.data.find(t => t.symbol === 'LINK')).toBeDefined();
    expect(result.data.find(t => t.symbol === 'SUI')).toBeDefined();
  });
});

describe("nansen.getSmartMoneyActivity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches smart money activity for a token", async () => {
    const mockResponse = {
      data: {
        data: [
          {
            token_address: '0x514910771af9ca656af840dff83e8264ecf986ca',
            symbol: 'LINK',
            smart_money_holders: 18,
            smart_money_buy_volume: 150000000,
            smart_money_sell_volume: 80000000,
            fresh_wallets_7d: 1250
          }
        ]
      }
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.nansen.getSmartMoneyActivity({ symbol: 'LINK' });

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.smartMoneyHolders).toBe(18);
    expect(result.data?.netSmartMoneyFlow).toBe(70000000); // 150M - 80M
    expect(result.data?.signal).toBe('accumulation'); // buy > sell
    expect(result.data?.confidence).toBe('medium'); // 10-20 holders
  });

  it("detects distribution signal when sells exceed buys", async () => {
    const mockResponse = {
      data: {
        data: [
          {
            token_address: '0x1',
            symbol: 'TOKEN',
            smart_money_holders: 12,
            smart_money_buy_volume: 50000000,
            smart_money_sell_volume: 120000000,
            fresh_wallets_7d: 500
          }
        ]
      }
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.nansen.getSmartMoneyActivity({ symbol: 'TOKEN' });

    expect(result.success).toBe(true);
    expect(result.data?.signal).toBe('distribution');
    expect(result.data?.netSmartMoneyFlow).toBe(-70000000);
  });

  it("returns error for unsupported token", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.nansen.getSmartMoneyActivity({ symbol: 'UNKNOWN' });

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toContain('not supported');
  });
});

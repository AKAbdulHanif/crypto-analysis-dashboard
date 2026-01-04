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

describe("crypto.getPrices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and transforms crypto prices successfully", async () => {
    const mockCoinGeckoResponse = [
      {
        id: 'sui',
        symbol: 'sui',
        name: 'Sui',
        current_price: 1.67,
        market_cap: 6350000000,
        total_volume: 1580000000,
        price_change_percentage_24h: 2.32,
        price_change_percentage_7d_in_currency: 15.10,
        price_change_percentage_30d_in_currency: 20.50
      },
      {
        id: 'chainlink',
        symbol: 'link',
        name: 'Chainlink',
        current_price: 13.31,
        market_cap: 9410000000,
        total_volume: 719730000,
        price_change_percentage_24h: -0.31,
        price_change_percentage_7d_in_currency: 5.20,
        price_change_percentage_30d_in_currency: -6.65
      }
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockCoinGeckoResponse });

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crypto.getPrices({ symbols: ['SUI', 'LINK'] });

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.data[0]).toMatchObject({
      symbol: 'SUI',
      name: 'Sui',
      price: 1.67,
      marketCap: 6350000000,
      volume24h: 1580000000,
      change24h: 2.32
    });
    expect(result.data[1]).toMatchObject({
      symbol: 'LINK',
      name: 'Chainlink',
      price: 13.31
    });
  });

  it("handles API errors gracefully", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API rate limit exceeded'));

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crypto.getPrices({ symbols: ['SUI'] });

    expect(result.success).toBe(false);
    expect(result.data).toEqual([]);
    expect(result.error).toBeDefined();
  });

  it("fetches all tokens when no symbols specified", async () => {
    const mockResponse = [
      {
        id: 'sui',
        symbol: 'sui',
        name: 'Sui',
        current_price: 1.67,
        market_cap: 6350000000,
        total_volume: 1580000000,
        price_change_percentage_24h: 2.32,
        price_change_percentage_7d_in_currency: 15.10,
        price_change_percentage_30d_in_currency: 20.50
      }
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crypto.getPrices({});

    expect(result.success).toBe(true);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/coins/markets'),
      expect.objectContaining({
        params: expect.objectContaining({
          vs_currency: 'usd'
        })
      })
    );
  });
});

describe("crypto.getTokenDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches detailed token information", async () => {
    const mockDetailResponse = {
      name: 'Sui',
      last_updated: '2026-01-04T12:00:00Z',
      market_data: {
        current_price: { usd: 1.67 },
        market_cap: { usd: 6350000000 },
        total_volume: { usd: 1580000000 },
        circulating_supply: 3800000000,
        total_supply: 10000000000,
        max_supply: 10000000000,
        price_change_percentage_24h: 2.32,
        price_change_percentage_7d: 15.10,
        price_change_percentage_30d: 20.50,
        ath: { usd: 2.51 },
        ath_date: { usd: '2024-03-15T00:00:00Z' },
        atl: { usd: 0.36 },
        atl_date: { usd: '2023-01-01T00:00:00Z' }
      }
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockDetailResponse });

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crypto.getTokenDetails({ symbol: 'SUI' });

    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      symbol: 'SUI',
      name: 'Sui',
      price: 1.67,
      marketCap: 6350000000,
      circulatingSupply: 3800000000,
      totalSupply: 10000000000
    });
  });

  it("returns error for unknown token", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crypto.getTokenDetails({ symbol: 'UNKNOWN' });

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toContain('not found');
  });

  it("handles API errors for token details", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.crypto.getTokenDetails({ symbol: 'SUI' });

    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toBeDefined();
  });
});

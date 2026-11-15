import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { CHAIN_RETIREMENTS, getGlobalChainCapability } from "./nansen-policy";
import {
  captureLifecycle,
  getSmartMoneyActivity,
  getTokenData,
  TOKEN_ADDRESSES,
} from "./nansen-client";
import { nansenRouter } from "./nansen";
import type { TrpcContext } from "./_core/context";

// Hard module replacement: there is no real Axios implementation or provider call.
vi.mock("axios", () => ({ default: { post: vi.fn() } }));
const post = vi.mocked(axios.post);
const payloadOf = (value: unknown) =>
  value as {
    chains: string[];
    timeframe: string;
    filters: { only_smart_money: boolean };
  };
const beforeNovember = new Date("2026-11-24T23:59:59.999Z");
function token(symbol = "LINK") {
  const info = TOKEN_ADDRESSES[symbol];
  return {
    token_address: info.address,
    chain: info.chain,
    symbol,
    name: symbol,
    price: 1,
    price_change_24h: 0,
    volume_24h: 100,
    market_cap: 1000,
    liquidity: 20,
    smart_money_holders: 15,
    fresh_wallets_24h: 1,
    buy_volume_24h: 60,
    sell_volume_24h: 40,
    holder_count: 100,
    smart_money_buy_volume: 60,
    smart_money_sell_volume: 40,
    fresh_wallets_7d: 2,
  };
}
function respond(
  rows: unknown,
  status = 200,
  headers: Record<string, string> = {}
) {
  return { status, headers, data: { data: rows } };
}
function mockAllChains() {
  post.mockImplementation(async (_url, payload) =>
    respond(
      Object.keys(TOKEN_ADDRESSES)
        .filter(
          symbol =>
            TOKEN_ADDRESSES[symbol].chain === payloadOf(payload).chains[0]
        )
        .map(symbol => token(symbol))
    )
  );
}
const requestedChains = () =>
  post.mock.calls.map(([, payload]) => payloadOf(payload).chains[0]);
beforeEach(() => {
  post.mockReset();
  // Do not read or use any real API credential, even when invoking the mock.
  vi.stubEnv("NANSEN_API_KEY", "");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe("pure global chain policy", () => {
  it("records the complete 14-chain and 7-chain schedule", () => {
    expect(CHAIN_RETIREMENTS[0].chains).toEqual([
      "algorand",
      "aptos",
      "chiliz",
      "gravity",
      "katana",
      "stacks",
      "stellar",
      "viction",
      "mantra",
      "citrea",
      "ton",
      "sonic",
      "plasma",
      "bitlayer",
    ]);
    expect(CHAIN_RETIREMENTS[1].chains).toEqual([
      "optimism",
      "arc",
      "starknet",
      "sei",
      "mantle",
      "sui",
      "avalanche",
    ]);
  });
  it.each([
    ["2026-11-24T23:59:59.999Z", true, true],
    ["2026-11-25T00:00:00.000Z", false, true],
    ["2027-01-31T23:59:59.999Z", false, true],
    ["2027-02-01T00:00:00.000Z", false, false],
  ] as const)(
    "applies every global retirement at %s",
    (date, novemberAvailable, februaryAvailable) => {
      for (const chain of CHAIN_RETIREMENTS[0].chains) {
        expect(getGlobalChainCapability(chain, new Date(date)).available).toBe(
          novemberAvailable
        );
      }
      for (const chain of CHAIN_RETIREMENTS[1].chains) {
        expect(getGlobalChainCapability(chain, new Date(date)).available).toBe(
          februaryAvailable
        );
      }
      expect(
        getGlobalChainCapability("ethereum", new Date(date)).available
      ).toBe(true);
      expect(post).not.toHaveBeenCalled();
    }
  );
  it("fails closed on an invalid clock without mutating assets", () => {
    expect(getGlobalChainCapability("aptos", new Date(NaN)).reason).toBe(
      "invalid_date"
    );
    expect(Object.keys(TOKEN_ADDRESSES)).toEqual([
      "SUI",
      "LINK",
      "APT",
      "SEI",
      "PYTH",
      "EIGEN",
    ]);
    expect(TOKEN_ADDRESSES.APT.address).toBe("0x1::aptos_coin::AptosCoin");
    expect(TOKEN_ADDRESSES.SEI.address).toBe("usei");
  });
});

describe("retirement-aware tRPC and client", () => {
  it.each([
    [
      "2026-11-24T23:59:59.999Z",
      ["sui", "ethereum", "aptos", "sei", "solana"],
      [],
    ],
    [
      "2026-11-25T00:00:00.000Z",
      ["sui", "ethereum", "sei", "solana"],
      ["aptos"],
    ],
    [
      "2027-01-31T23:59:59.999Z",
      ["sui", "ethereum", "sei", "solana"],
      ["aptos"],
    ],
    [
      "2027-02-01T00:00:00.000Z",
      ["ethereum", "solana"],
      ["sui", "aptos", "sei"],
    ],
  ])(
    "preserves default requested universe and skips only retired chains at %s",
    async (date, completed, unavailable) => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(date as string));
      mockAllChains();
      const caller = nansenRouter.createCaller({
        user: null,
        req: {},
        res: {},
      } as TrpcContext);
      const result = await caller.getTokenData({});
      expect(requestedChains()).toEqual(completed);
      expect(result.coverage.requested).toEqual([
        "sui",
        "ethereum",
        "aptos",
        "sei",
        "solana",
      ]);
      expect(result.coverage.completed).toEqual(completed);
      expect(result.coverage.unavailable).toEqual(unavailable);
      expect(result.success).toBe((unavailable as string[]).length === 0);
      expect(result.data.length).toBe(
        (unavailable as string[]).length === 0 ? 6 : 0
      );
      for (const [url, payload, config] of post.mock.calls) {
        expect(url).toBe("https://api.nansen.ai/api/v1/token-screener");
        expect(payloadOf(payload).timeframe).toBe("24h");
        expect(config?.headers?.apiKey).toBe("");
      }
    }
  );
  it("does not apply the December four-chain indicators restriction to token screener", async () => {
    mockAllChains();
    const result = await getTokenData(
      ["SUI", "SEI"],
      new Date("2026-12-04T00:00:00Z")
    );
    expect(requestedChains()).toEqual(["sui", "sei"]);
    expect(result.success).toBe(true);
  });
  it.each([
    ["APT", "2026-11-24T23:59:59.999Z", true],
    ["APT", "2026-11-25T00:00:00.000Z", false],
    ["SUI", "2027-01-31T23:59:59.999Z", true],
    ["SUI", "2027-02-01T00:00:00.000Z", false],
    ["SEI", "2027-02-01T00:00:00.000Z", false],
  ] as const)(
    "smart money respects %s cutover at %s",
    async (symbol, date, available) => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(date));
      mockAllChains();
      const caller = nansenRouter.createCaller({
        user: null,
        req: {},
        res: {},
      } as TrpcContext);
      const result = await caller.getSmartMoneyActivity({ symbol });
      expect(result.success).toBe(available);
      expect(post).toHaveBeenCalledTimes(available ? 1 : 0);
      if (!available) {
        expect(result.data).toBeNull();
        expect(result.coverage.chains[0].code).toBe("chain_retired");
      } else {
        expect(payloadOf(post.mock.calls[0][1]).timeframe).toBe("7d");
        expect(payloadOf(post.mock.calls[0][1]).filters.only_smart_money).toBe(
          true
        );
      }
    }
  );
  it("withholds good rows when another chain errors, without leaking Axios secrets", async () => {
    post.mockResolvedValueOnce(respond([token()])).mockRejectedValueOnce({
      message: "secret-placeholder",
      config: { headers: { apiKey: "secret-placeholder" } },
      response: {
        status: 429,
        data: { message: "secret-placeholder" },
        headers: { Warning: "secret-placeholder" },
      },
    });
    const result = await getTokenData(["LINK", "APT"], beforeNovember);
    expect(result.success).toBe(false);
    expect(result.data).toEqual([]);
    expect(result.coverage.completed).toEqual(["ethereum"]);
    expect(result.coverage.error).toEqual(["aptos"]);
    expect(result.coverage.chains[1].httpStatus).toBe(429);
    expect(result.coverage.chains[1].lifecycle.warning).toBe(true);
    expect(JSON.stringify(result)).not.toContain("secret-placeholder");
  });
  it("does not mark an all-failed batch successful", async () => {
    post.mockRejectedValue(new Error("private request details"));
    const result = await getTokenData(undefined, beforeNovember);
    expect(result.success).toBe(false);
    expect(result.data).toEqual([]);
    expect(result.coverage.error).toEqual([
      "sui",
      "ethereum",
      "aptos",
      "sei",
      "solana",
    ]);
    expect(result.coverage.completed).toEqual([]);
    expect(JSON.stringify(result)).not.toContain("private request details");
  });
  it.each([400, 401, 403, 500])(
    "rejects bad HTTP %i even if rows exist",
    async status => {
      post.mockResolvedValue(respond([token()], status));
      const result = await getTokenData(["LINK"], beforeNovember);
      expect(result.success).toBe(false);
      expect(result.coverage.chains[0].code).toBe("http_error");
    }
  );
  it.each(
    [[], {}, null, "rows", [null], [{ symbol: "LINK" }]].map(rows => ({ rows }))
  )("rejects empty or wrong rows $rows", async ({ rows }) => {
    post.mockResolvedValue(respond(rows));
    const result = await getTokenData(["LINK"], beforeNovember);
    expect(result.success).toBe(false);
    expect(result.data).toEqual([]);
  });
  it.each([{}, { data: null }, { other: [] }])(
    "rejects absent/wrong envelope %j",
    async data => {
      post.mockResolvedValue({ status: 200, headers: {}, data });
      expect((await getTokenData(["LINK"], beforeNovember)).success).toBe(
        false
      );
    }
  );
  it.each([
    "price",
    "price_change_24h",
    "volume_24h",
    "market_cap",
    "liquidity",
    "smart_money_holders",
    "fresh_wallets_24h",
    "buy_volume_24h",
    "sell_volume_24h",
    "holder_count",
  ])("rejects missing required token metric %s", async field => {
    const row: Record<string, unknown> = token();
    delete row[field];
    post.mockResolvedValue(respond([row]));
    const result = await getTokenData(["LINK"], beforeNovember);
    expect(result.success).toBe(false);
    expect(result.data).toEqual([]);
    expect(result.coverage.chains[0].code).toBe("invalid_metrics");
  });
  it.each([null, "0", NaN, Infinity])(
    "does not coerce invalid metrics %j to zero",
    async value => {
      post.mockResolvedValue(respond([{ ...token(), price: value }]));
      expect((await getTokenData(["LINK"], beforeNovember)).success).toBe(
        false
      );
    }
  );
  it.each([
    "smart_money_holders",
    "smart_money_buy_volume",
    "smart_money_sell_volume",
    "fresh_wallets_7d",
  ])("rejects missing required smart-money metric %s", async field => {
    const row: Record<string, unknown> = token();
    delete row[field];
    post.mockResolvedValue(respond([row]));
    const result = await getSmartMoneyActivity("LINK", beforeNovember);
    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.coverage.chains[0].code).toBe("invalid_metrics");
  });
  it.each([0, 100])(
    "preserves legitimate buy pressure %i with a zero on one side",
    async pressure => {
      post.mockResolvedValue(
        respond([
          {
            ...token(),
            buy_volume_24h: pressure,
            sell_volume_24h: 100 - pressure,
            price: 0,
            holder_count: 0,
          },
        ])
      );
      const result = await getTokenData(["LINK"], beforeNovember);
      expect(result.success).toBe(true);
      expect(result.data[0].price).toBe(0);
      expect(result.data[0].holderCount).toBe(0);
      expect(result.data[0].buyPressure).toBe(pressure.toFixed(2));
    }
  );
  it("keeps observed zero flows zero, but does not fabricate neutral buy pressure", async () => {
    const row = {
      ...token(),
      buy_volume_24h: 0,
      sell_volume_24h: 0,
      smart_money_buy_volume: 0,
      smart_money_sell_volume: 0,
    };
    post.mockResolvedValue(respond([row]));
    expect(
      (await getTokenData(["LINK"], beforeNovember)).data[0].buyPressure
    ).toBeNull();
    const result = await getSmartMoneyActivity("LINK", beforeNovember);
    expect(result.success).toBe(true);
    expect(result.data?.netSmartMoneyFlow).toBe(0);
    expect(result.data?.signal).toBe("neutral");
  });
  it("does not substitute a token by symbol or another chain", async () => {
    post.mockResolvedValue(
      respond([{ ...token(), token_address: "different-token" }])
    );
    let result = await getTokenData(["LINK"], beforeNovember);
    expect(result.success).toBe(false);
    expect(result.coverage.chains[0].code).toBe("missing_token");
    post.mockResolvedValue(respond([{ ...token(), chain: "solana" }]));
    result = await getTokenData(["LINK"], beforeNovember);
    expect(result.coverage.chains[0].code).toBe("invalid_response");
  });
  it("keeps Solana address case significant", async () => {
    post.mockResolvedValue(
      respond([
        {
          ...token("PYTH"),
          token_address: TOKEN_ADDRESSES.PYTH.address.toLowerCase(),
        },
      ])
    );
    expect((await getTokenData(["PYTH"], beforeNovember)).success).toBe(false);
  });
  it("accepts equivalent EVM address casing", async () => {
    post.mockResolvedValue(
      respond([
        {
          ...token(),
          token_address: TOKEN_ADDRESSES.LINK.address.toUpperCase(),
        },
      ])
    );
    expect((await getTokenData(["LINK"], beforeNovember)).success).toBe(true);
  });
  it.each(
    [[], ["UNKNOWN"], ["LINK", "UNKNOWN"], ["toString"], ["__proto__"]].map(
      symbols => ({ symbols })
    )
  )(
    "does not succeed for empty or unsupported scope $symbols",
    async ({ symbols }) => {
      mockAllChains();
      const result = await getTokenData(symbols, beforeNovember);
      expect(result.success).toBe(false);
      expect(result.data).toEqual([]);
      expect(result.coverage.unsupportedSymbols).toEqual(
        symbols.filter(symbol => !Object.hasOwn(TOKEN_ADDRESSES, symbol))
      );
    }
  );
  it("captures lifecycle presence and parsed sunset, not raw unsafe text", () => {
    expect(
      captureLifecycle({
        Warning: "secret-placeholder\r\n",
        Deprecation: "secret-placeholder",
        Sunset: "Mon, 01 Feb 2027 00:00:00 GMT",
        apiKey: "secret-placeholder",
      })
    ).toEqual({
      warning: true,
      deprecation: true,
      sunset: "2027-02-01T00:00:00.000Z",
    });
    expect(
      captureLifecycle({ sunset: "secret-placeholder" }).sunset
    ).toBeNull();
  });
  it("captures lifecycle on a successful response safely", async () => {
    post.mockResolvedValue(
      respond([token()], 200, {
        warning: "secret-placeholder",
        deprecation: "@123",
        sunset: "Mon, 01 Feb 2027 00:00:00 GMT",
      })
    );
    const result = await getTokenData(["LINK"], beforeNovember);
    expect(result.coverage.chains[0].lifecycle.warning).toBe(true);
    expect(result.coverage.chains[0].lifecycle.deprecation).toBe(true);
    expect(JSON.stringify(result)).not.toContain("secret-placeholder");
  });
});

describe("REST Ethereum/Solana adapter remains dormant and fails closed", () => {
  it("provides validated UI-safe camelCase fields only for the original chains", async () => {
    mockAllChains();
    const result = await getTokenData(
      undefined,
      new Date("2027-02-01T00:00:00Z"),
      true
    );
    expect(result.success).toBe(true);
    expect(requestedChains()).toEqual(["ethereum", "solana"]);
    expect(
      result.data.every(
        row =>
          typeof row.holderCount === "number" &&
          typeof row.volume24h === "number"
      )
    ).toBe(true);
  });
  it.each(["empty", "malformed", "http"])(
    "cannot produce an empty successful Live Data badge on %s",
    async failure => {
      post.mockResolvedValueOnce(respond([token()]));
      if (failure === "http")
        post.mockRejectedValueOnce(new Error("private provider details"));
      else
        post.mockResolvedValueOnce(
          respond(
            failure === "empty"
              ? []
              : [{ ...token("PYTH"), holder_count: undefined }]
          )
        );
      const result = await getTokenData(undefined, beforeNovember, true);
      expect(result.success).toBe(false);
      expect(result.data).toEqual([]);
      expect(result.coverage.completed).toEqual(["ethereum"]);
    }
  );
});

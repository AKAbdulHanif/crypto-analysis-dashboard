import axios from "axios";
import { z } from "zod";
import { getGlobalChainCapability } from "./nansen-policy";

export const TOKEN_ADDRESSES: Record<
  string,
  { chain: string; address: string }
> = {
  SUI: { chain: "sui", address: "0x2::sui::SUI" },
  LINK: {
    chain: "ethereum",
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
  },
  APT: { chain: "aptos", address: "0x1::aptos_coin::AptosCoin" },
  SEI: { chain: "sei", address: "usei" },
  PYTH: {
    chain: "solana",
    address: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
  },
  EIGEN: {
    chain: "ethereum",
    address: "0xec53bf9167f50cdeb3ae105f56099aaab9061f83",
  },
};

const tokenInfo = (symbol: string) =>
  Object.hasOwn(TOKEN_ADDRESSES, symbol) ? TOKEN_ADDRESSES[symbol] : undefined;
const timestampFor = (now: Date) =>
  Number.isFinite(now.getTime()) ? now.toISOString() : null;

const identitySchema = z.object({
  token_address: z.string().min(1),
  chain: z.string().min(1),
  symbol: z.string().min(1),
  name: z.string().optional(),
});
const metric = z.number().finite();
const tokenSchema = identitySchema.extend({
  price: metric,
  price_change_24h: metric,
  volume_24h: metric,
  market_cap: metric,
  liquidity: metric,
  smart_money_holders: metric,
  fresh_wallets_24h: metric,
  buy_volume_24h: metric,
  sell_volume_24h: metric,
  holder_count: metric,
});
const smartSchema = identitySchema.extend({
  smart_money_holders: metric,
  smart_money_buy_volume: metric,
  smart_money_sell_volume: metric,
  fresh_wallets_7d: metric,
});

// Never return or log raw provider header text, request headers, bodies or Axios errors.
export function captureLifecycle(headers: unknown) {
  const source =
    headers && typeof headers === "object"
      ? (headers as Record<string, unknown>)
      : {};
  const read = (name: string) =>
    Object.entries(source).find(([key]) => key.toLowerCase() === name)?.[1];
  const sunsetValue = read("sunset");
  const sunsetDate =
    typeof sunsetValue === "string" ? Date.parse(sunsetValue) : NaN;
  return {
    warning: read("warning") !== undefined,
    deprecation: read("deprecation") !== undefined,
    sunset: Number.isFinite(sunsetDate)
      ? new Date(sunsetDate).toISOString()
      : null,
  };
}
type Lifecycle = ReturnType<typeof captureLifecycle>;
export type ChainCoverage = {
  chain: string;
  symbols: string[];
  status: "completed" | "unavailable" | "error";
  code?:
    | "chain_retired"
    | "invalid_date"
    | "empty_data"
    | "missing_token"
    | "invalid_response"
    | "invalid_metrics"
    | "http_error"
    | "request_failed";
  retiredAt?: string | null;
  httpStatus?: number;
  lifecycle: Lifecycle;
};
const noLifecycle = () => captureLifecycle(null);

function sameAddress(actual: string, expected: string) {
  // EVM hex is case-insensitive; Solana/base58 and other native IDs are not.
  return /^0x[0-9a-f]{40}$/i.test(expected)
    ? actual.toLowerCase() === expected.toLowerCase()
    : actual === expected;
}
function coverageFor(
  chains: ChainCoverage[],
  unsupportedSymbols: string[] = []
) {
  return {
    requested: chains.map(item => item.chain),
    completed: chains
      .filter(item => item.status === "completed")
      .map(item => item.chain),
    unavailable: chains
      .filter(item => item.status === "unavailable")
      .map(item => item.chain),
    error: chains
      .filter(item => item.status === "error")
      .map(item => item.chain),
    chains,
    unsupportedSymbols,
  };
}

async function requestChain(chain: string, smart: boolean, rest = false) {
  try {
    const response = await axios.post(
      "https://api.nansen.ai/api/v1/token-screener",
      {
        chains: [chain],
        timeframe: smart ? "7d" : "24h",
        pagination: { page: 1, per_page: smart || rest ? 50 : 100 },
        filters: { only_smart_money: smart },
        order_by: [
          { field: smart ? "holders_count" : "volume", direction: "DESC" },
        ],
      },
      {
        headers: {
          apiKey: process.env.NANSEN_API_KEY || "",
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );
    const lifecycle = captureLifecycle(response.headers);
    if (
      !Number.isInteger(response.status) ||
      response.status < 200 ||
      response.status >= 300
    ) {
      return {
        rows: null,
        code: "http_error" as const,
        lifecycle,
        httpStatus: Number.isInteger(response.status)
          ? response.status
          : undefined,
      };
    }
    if (!response.data || !Array.isArray(response.data.data)) {
      return { rows: null, code: "invalid_response" as const, lifecycle };
    }
    if (response.data.data.length === 0) {
      return { rows: null, code: "empty_data" as const, lifecycle };
    }
    return { rows: response.data.data as unknown[], lifecycle };
  } catch (error: unknown) {
    const response =
      error && typeof error === "object" && "response" in error
        ? (error as { response?: { status?: unknown; headers?: unknown } })
            .response
        : undefined;
    const status = response?.status;
    return {
      rows: null,
      code: response ? ("http_error" as const) : ("request_failed" as const),
      lifecycle: captureLifecycle(response?.headers),
      httpStatus:
        typeof status === "number" &&
        Number.isInteger(status) &&
        status >= 100 &&
        status <= 599
          ? status
          : undefined,
    };
  }
}

function toTokenData(token: z.infer<typeof tokenSchema>) {
  const volume = token.buy_volume_24h + token.sell_volume_24h;
  return {
    symbol: token.symbol,
    name: token.name || token.symbol,
    chain: token.chain,
    price: token.price,
    priceChange24h: token.price_change_24h,
    volume24h: token.volume_24h,
    marketCap: token.market_cap,
    liquidity: token.liquidity,
    smartMoneyHolders: token.smart_money_holders,
    freshWallets24h: token.fresh_wallets_24h,
    buyVolume24h: token.buy_volume_24h,
    sellVolume24h: token.sell_volume_24h,
    holderCount: token.holder_count,
    // No fabricated neutral value when both observed flows are zero.
    buyPressure:
      volume > 0 ? ((token.buy_volume_24h / volume) * 100).toFixed(2) : null,
    smartMoneySignal:
      token.smart_money_holders > 10
        ? "bullish"
        : token.smart_money_holders > 5
          ? "neutral"
          : "bearish",
  };
}

export async function getTokenData(
  symbols?: string[],
  now = new Date(),
  rest = false
) {
  const requestedSymbols = Array.from(
    new Set(symbols ?? Object.keys(TOKEN_ADDRESSES))
  );
  const unsupportedSymbols = requestedSymbols.filter(
    symbol => !tokenInfo(symbol)
  );
  const groups = new Map<string, string[]>();
  if (rest) {
    // Preserve REST's Ethereum/Solana universe; do not activate or redesign its dormant UI.
    groups.set("ethereum", []);
    groups.set("solana", []);
  } else {
    for (const symbol of requestedSymbols) {
      const info = tokenInfo(symbol);
      if (info)
        groups.set(info.chain, [...(groups.get(info.chain) ?? []), symbol]);
    }
  }
  const chains: ChainCoverage[] = [];
  const rows: ReturnType<typeof toTokenData>[] = [];
  for (const [chain, chainSymbols] of Array.from(groups.entries())) {
    const capability = getGlobalChainCapability(chain, now);
    const entry: ChainCoverage = {
      chain,
      symbols: chainSymbols,
      status: "unavailable",
      lifecycle: noLifecycle(),
    };
    chains.push(entry);
    if (!capability.available) {
      entry.code = capability.reason ?? "chain_retired";
      entry.retiredAt = capability.retiredAt;
      continue;
    }
    const response = await requestChain(chain, false, rest);
    entry.lifecycle = response.lifecycle;
    if (!response.rows) {
      entry.code = response.code;
      entry.status = response.code === "empty_data" ? "unavailable" : "error";
      entry.httpStatus = response.httpStatus;
      continue;
    }
    // Fail closed on malformed identities (including non-object rows) or cross-chain results.
    const identities = response.rows.map(row => identitySchema.safeParse(row));
    if (
      identities.some(result => !result.success || result.data.chain !== chain)
    ) {
      entry.status = "error";
      entry.code = "invalid_response";
      continue;
    }
    const selected = rest
      ? response.rows
      : chainSymbols.map(symbol => {
          const info = TOKEN_ADDRESSES[symbol];
          return response.rows!.find(row => {
            const identity = identitySchema.parse(row);
            return (
              sameAddress(identity.token_address, info.address) &&
              identity.symbol.toUpperCase() === symbol
            );
          });
        });
    if (selected.some(row => row === undefined)) {
      entry.code = "missing_token";
      continue;
    }
    const parsed = selected.map(row => tokenSchema.safeParse(row));
    if (parsed.some(result => !result.success)) {
      entry.status = "error";
      entry.code = "invalid_metrics";
      continue;
    }
    entry.status = "completed";
    for (const result of parsed) {
      if (result.success) rows.push(toTokenData(result.data));
    }
  }
  const success =
    chains.length > 0 &&
    chains.every(entry => entry.status === "completed") &&
    unsupportedSymbols.length === 0;
  return {
    success,
    data: success ? rows : [],
    error: success
      ? undefined
      : "Nansen data unavailable or incomplete; inspect coverage",
    coverage: coverageFor(chains, unsupportedSymbols),
    timestamp: timestampFor(now),
    source: "nansen" as const,
  };
}

export async function getSmartMoneyActivity(symbol: string, now = new Date()) {
  const info = tokenInfo(symbol);
  const chains: ChainCoverage[] = [];
  const finish = (
    data: {
      symbol: string;
      smartMoneyHolders: number;
      smartMoneyBuyVolume: number;
      smartMoneySellVolume: number;
      netSmartMoneyFlow: number;
      freshWallets7d: number;
      signal: string;
      confidence: string;
    } | null
  ) => ({
    success: data !== null,
    data,
    error: data
      ? undefined
      : "Nansen smart money data unavailable; inspect coverage",
    coverage: coverageFor(chains, info ? [] : [symbol]),
    timestamp: timestampFor(now),
    source: "nansen" as const,
  });
  if (!info) return finish(null);
  const entry: ChainCoverage = {
    chain: info.chain,
    symbols: [symbol],
    status: "unavailable",
    lifecycle: noLifecycle(),
  };
  chains.push(entry);
  const capability = getGlobalChainCapability(info.chain, now);
  if (!capability.available) {
    entry.code = capability.reason ?? "chain_retired";
    entry.retiredAt = capability.retiredAt;
    return finish(null);
  }
  const response = await requestChain(info.chain, true);
  entry.lifecycle = response.lifecycle;
  if (!response.rows) {
    entry.code = response.code;
    entry.status = response.code === "empty_data" ? "unavailable" : "error";
    entry.httpStatus = response.httpStatus;
    return finish(null);
  }
  const identities = response.rows.map(row => identitySchema.safeParse(row));
  if (
    identities.some(
      result => !result.success || result.data.chain !== info.chain
    )
  ) {
    entry.status = "error";
    entry.code = "invalid_response";
    return finish(null);
  }
  const row = response.rows.find(row => {
    const identity = identitySchema.parse(row);
    return (
      sameAddress(identity.token_address, info.address) &&
      identity.symbol.toUpperCase() === symbol
    );
  });
  if (!row) {
    entry.code = "missing_token";
    return finish(null);
  }
  const parsed = smartSchema.safeParse(row);
  if (!parsed.success) {
    entry.status = "error";
    entry.code = "invalid_metrics";
    return finish(null);
  }
  entry.status = "completed";
  const token = parsed.data;
  const flow = token.smart_money_buy_volume - token.smart_money_sell_volume;
  return finish({
    symbol,
    smartMoneyHolders: token.smart_money_holders,
    smartMoneyBuyVolume: token.smart_money_buy_volume,
    smartMoneySellVolume: token.smart_money_sell_volume,
    netSmartMoneyFlow: flow,
    freshWallets7d: token.fresh_wallets_7d,
    signal: flow > 0 ? "accumulation" : flow < 0 ? "distribution" : "neutral",
    confidence:
      token.smart_money_holders > 20
        ? "high"
        : token.smart_money_holders > 10
          ? "medium"
          : "low",
  });
}

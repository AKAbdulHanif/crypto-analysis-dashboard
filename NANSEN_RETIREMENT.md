# Nansen retirement safeguards

The integration still calls **POST `/api/v1/token-screener`**. It does not call Nansen Score Top Tokens or TGM Indicators, so the December 4 four-chain Indicators restriction is not applied to token screener. The original SUI, LINK, APT, SEI, PYTH and EIGEN mapping and contract addresses remain intact, including the native SEI address. Default tRPC requests still mean all six locally mapped assets, not the provider's `all` selector.

## Global retirement policy

`server/nansen-policy.ts` is a pure, clock-injected policy. The 14 globally retiring chains become unavailable on November 25, 2026. Optimism, Arc, Starknet, Sei, Mantle, Sui and Avalanche become unavailable on February 1, 2027. The schedule includes the November 7 Avalanche correction. Calendar dates are interpreted conservatively as midnight UTC; the cited notice specifies dates, not an exact time of day. A non-retired result means only that this global retirement policy permits a request: it does not assert support by every endpoint.

Before the respective dates, existing mapped chain requests remain enabled. Afterwards, APT, and later SUI and SEI, remain in requested coverage but are not sent upstream. Neither chain nor token is substituted. `getSmartMoneyActivity` uses the same policy. Invalid clocks fail closed.

Official sources, verified on November 15, 2026:

- [Chain retirement schedule](https://docs.nansen.ai/api/changelog/29-10-2026-chain-retirement)
- [Supported chain values](https://docs.nansen.ai/reference/chains)
- [API migration and lifecycle signals](https://docs.nansen.ai/api-migration)

## Response contract

Token batches return `success: true` only when every requested chain completes with valid rows for every requested mapped token. Retired chains, empty responses, missing tokens, malformed envelopes or identities, missing/non-finite required metrics, HTTP failures and unsupported symbols prevent complete success. An explicit empty symbol list is unavailable, not successful live data.

Any incomplete token batch withholds **all** rows: `success: false`, `data: []`, and a generic unavailable/incomplete message. A single smart-money result uses `success: false`, `data: null`. No populated zero or neutral fallback row is generated on failure. `coverage` retains `requested`, `completed`, `unavailable` and `error` chain arrays, detailed per-chain status/code/symbols, and `unsupportedSymbols`. Completed coverage describes validated upstream observations, not rows released to the caller. There is no successful partial-data contract.

Matching requires the actual mapped contract address and chain, plus the matching symbol. EVM hex addresses compare case-insensitively; Solana/base58 and native identifiers compare exactly. Symbol-only matches cannot substitute another token. A mapped token outside the existing first-page response is unavailable rather than silently omitted; this bounded patch does not add pagination or new provider endpoints.

Required metrics must be finite numbers; missing fields and numeric strings are not coerced to zero. Legitimate observed zeros remain zero. Buy pressure correctly reports 0% or 100% when one observed flow is zero; when both observed flows are zero, the ratio is undefined and `buyPressure` is `null`, not a fabricated 50%. Equal observed smart-money flows produce a neutral comparison rather than distribution. Other holder-threshold signals remain application heuristics, not Nansen Score.

`coverage.chains[].lifecycle` captures Warning and Deprecation **presence** plus a valid Sunset normalized to ISO UTC. Free-text warning messages, deprecation header values, response bodies, request headers, keys and raw Axios errors are neither returned nor logged. HTTP status and controlled error codes provide safe diagnostics. These lifecycle signals do not automatically change routes or fields. The existing `only_smart_money` request field is preserved; the official migration page currently deprecates it in favor of `trader_type`, which is outside this retirement-scoped payload change.

## REST compatibility without UI activation

GET `/api/nansen` still requests only Ethereum and Solana and is not directly affected by these global retirements. It now uses the validated camelCase adapter so the existing dormant component cannot receive a successful empty array or a row missing numeric `holderCount`. Empty, malformed or failed data returns HTTP 503 with `success: false`. The route retains its no-key guard and uses generic safe errors.

The REST adapter makes one bounded request per original chain, at the original 50-row page size, instead of the former combined request. tRPC retains its original 100-row token page size and 50-row smart-money page size. Requests remain sequential, have a 15-second timeout each, and do not retry automatically. REST can therefore make two upstream requests rather than one when used later; no upstream request was made during this change. No UI component was enabled, redesigned or deployed, and the dormant component's broader filtering/refresh behavior remains out of scope.

## Offline verification

Install only in an authorized development checkout:

```sh
pnpm install --frozen-lockfile --ignore-scripts
```

Run **only** this explicitly included, hard-mocked file:

```sh
pnpm exec vitest run --config vitest.nansen-mocked.config.ts server/nansen-retirement.mocked.test.ts
pnpm exec tsc --project tsconfig.nansen.json --noEmit
pnpm exec tsc --noEmit
pnpm exec prettier --check server/nansen-policy.ts server/nansen-client.ts server/nansen.ts server/nansen-retirement.mocked.test.ts vitest.nansen-mocked.config.ts tsconfig.nansen.json NANSEN_RETIREMENT.md
git diff --check
```

The dedicated Vitest configuration includes only the new mocked regression file and explicitly excludes `nansen.validate.test.ts`. Axios is replaced completely, and tests set `NANSEN_API_KEY` to an empty string. **Do not run the repository's default test command for this verification**: it discovers the existing live validation test. Existing unrelated tests are neither run nor repaired by this change. No account, credits, live response schema, paid API or production behavior has been verified; schema checks deliberately fail closed against the repository's existing field contract.

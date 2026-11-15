// Global retirement only: this is NOT an endpoint-specific support allowlist.
// Source: https://docs.nansen.ai/api/changelog/29-10-2026-chain-retirement
// Calendar-date cutovers are interpreted conservatively as midnight UTC.
export const CHAIN_RETIREMENTS = [
  {
    at: "2026-11-25T00:00:00.000Z",
    chains: [
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
    ],
  },
  {
    at: "2027-02-01T00:00:00.000Z",
    chains: [
      "optimism",
      "arc",
      "starknet",
      "sei",
      "mantle",
      "sui",
      "avalanche",
    ],
  },
] as const;

export function getGlobalChainCapability(chain: string, now: Date) {
  const retirement = CHAIN_RETIREMENTS.find(group =>
    (group.chains as readonly string[]).includes(chain)
  );
  const retiredAt = retirement?.at ?? null;
  if (!Number.isFinite(now.getTime())) {
    return { available: false, retiredAt, reason: "invalid_date" as const };
  }
  const retired = retiredAt !== null && now.getTime() >= Date.parse(retiredAt);
  return {
    available: !retired,
    retiredAt,
    reason: retired ? ("chain_retired" as const) : null,
  };
}

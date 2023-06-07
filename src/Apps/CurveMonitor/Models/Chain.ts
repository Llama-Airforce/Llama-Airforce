export const chains = [
  "mainnet",
  "arbitrum",
  "optimism",
  "fantom",
  "avalanche",
  "xdai",
  "matic",
  "harmony",
  "moonbeam",
] as const;

export type Chain = typeof chains[number];

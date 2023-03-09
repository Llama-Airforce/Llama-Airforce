const chains = [
  "mainnet",
  "arbitrum",
  "avalanche",
  "fantom",
  "harmony",
  "matic",
  "moonbeam",
  "optimism",
  "xdai",
] as const;

export type Chain = typeof chains[number];

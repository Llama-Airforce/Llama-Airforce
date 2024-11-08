export const chains = [
  "ethereum",
  "arbitrum",
  "optimism",
  "fantom",
  "avalanche",
  "xdai",
  "matic",
  "harmony",
  "moonbeam",
  "base",
  "polygon",
  "fraxtal",
] as const;

export type Chain = (typeof chains)[number];

export function isChain(chain: string): chain is Chain {
  return chains.includes(chain as Chain);
}

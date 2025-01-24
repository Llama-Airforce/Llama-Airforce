/**
 * Options for making API requests
 * @example
 * const options: Options = {
 *   host: Promise.resolve("http://localhost:3000"), // Custom host for local testing
 *   signal: new AbortController().signal // For request cancellation
 * }
 */
export type Options = {
  host?: Promise<string>;
  signal?: AbortSignal;
};

/**
 * Gets the API host URL, using the provided host or falling back to default
 * @param options - Optional configuration options
 * @returns Promise that resolves to the host URL
 * @example
 * const host = await getHost() // "https://prices.curve.fi"
 */
export const getHost = (options?: Options): Required<Options>["host"] =>
  options?.host ?? Promise.resolve("https://prices.curve.fi");

/**
 * List of supported blockchain networks
 * @example
 * const chain: Chain = "ethereum"
 */
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

// Copied from Viem such that you don't actually need a Viem dependency but may also use Ethers.
export type Address = `0x${string}`;

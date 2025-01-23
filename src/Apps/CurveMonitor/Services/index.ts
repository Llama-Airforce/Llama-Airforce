export type Options = {
  host?: Promise<string>;
  signal?: AbortSignal;
};

export const getHost = (options?: Options): Required<Options>["host"] =>
  options?.host ?? Promise.resolve("https://prices.curve.fi");

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

export type Address = `0x${string}`;

export function toUTC(timestamp: string | number): number {
  if (typeof timestamp === "number") {
    return timestamp;
  }

  const parsed = Number(timestamp);
  if (!Number.isNaN(parsed)) {
    return parsed;
  }

  const [date, time] = timestamp.split("T");
  const [year, month, day] = date.split("-").map(Number);
  const [timeWithoutZ] = time.split("."); // Handle milliseconds by splitting on dot
  const [hour, minute, second] = timeWithoutZ.split(":").map(Number);

  return Date.UTC(year, month - 1, day, hour, minute, second) / 1000;
}

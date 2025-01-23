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

export class FetchError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/**
 * Fetches data from a URL and parses the response as JSON.
 *
 * @template T - The expected type of the parsed JSON data.
 * @param url - The URL to fetch from.
 * @param body - Optional request body for POST requests.
 * @param signal - Optional AbortSignal to abort the fetch request.
 * @returns A Promise that resolves to the parsed JSON data of type T.
 * @throws Error if the fetch fails or returns a non-2xx status code.
 */
export async function fetchJson<T>(
  url: string,
  body?: Record<string, unknown>,
  signal?: AbortSignal
): Promise<T> {
  try {
    const resp = await fetch(url, {
      method: body ? "POST" : "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal,
    });

    if (!resp.ok) {
      // make the promise be rejected if we didn't get a 2xx response
      throw new FetchError(
        resp.status,
        `Fetch error ${resp.status} for URL: ${url}`
      );
    } else {
      const json = (await resp.json()) as T;

      return json;
    }
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error(`Unknown fetch error`);
  }
}

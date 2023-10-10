import "cross-fetch/polyfill";

export const hostDev = "https://localhost:7019";
export const hostProd = "https://api.llama.airforce/";

async function fetchWork(
  url: string,
  body?: Record<string, unknown>,
  signal?: AbortSignal
): Promise<Response> {
  return await fetch(url, {
    method: body ? "POST" : "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal,
  }).then((resp) => {
    if (!resp.ok) {
      // make the promise be rejected if we didn't get a 2xx response
      throw new Error(`Fetch error ${resp.status} for URL: ${url}`);
    } else {
      return resp;
    }
  });
}

export async function fetchType<T>(
  url: string,
  body?: Record<string, unknown>,
  signal?: AbortSignal
): Promise<T> {
  const res = await fetchWork(url, body, signal);
  const json = (await res.json()) as T;

  return json;
}

export async function fetchText(
  url: string,
  body?: Record<string, unknown>,
  signal?: AbortSignal
): Promise<string> {
  const res = await fetchWork(url, body, signal);
  const text = await res.text();

  return text;
}

export default class ServiceBase {
  public readonly host: string;

  constructor(host: string) {
    this.host = host;
  }

  public async fetch<T>(
    url: string,
    body?: Record<string, unknown>,
    signal?: AbortSignal
  ): Promise<T> {
    return fetchType<T>(url, body, signal);
  }
}

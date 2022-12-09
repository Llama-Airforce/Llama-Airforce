import { fetch as crossFetch } from "cross-fetch";
import { ClassConstructor, plainToClass } from "class-transformer";

export const hostDev = "https://localhost:7019";
export const hostProd = "https://api.llama.airforce/";

async function fetchWork(
  url: string,
  body?: Record<string, unknown>
): Promise<Response> {
  return await crossFetch(url, {
    method: body ? "POST" : "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function fetchType<T>(
  url: string,
  body?: Record<string, unknown>
): Promise<T> {
  const res = await fetchWork(url, body);
  const json = (await res.json()) as T;

  return json;
}

export async function fetchClass<T>(
  url: string,
  type: ClassConstructor<T>,
  body?: Record<string, unknown>
): Promise<T> {
  return plainToClass(type, await fetchType<T>(url, body));
}

export async function fetchText(
  url: string,
  body?: Record<string, unknown>
): Promise<string> {
  const res = await fetchWork(url, body);
  const text = await res.text();

  return text;
}

export default class ServiceBase {
  public readonly host: string;

  constructor(host: string) {
    this.host = host;
  }

  public async fetchType<T>(
    url: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    return fetchType<T>(url, body);
  }

  public async fetch<T>(
    url: string,
    type: ClassConstructor<T>,
    body?: Record<string, unknown>
  ): Promise<T> {
    return fetchClass(url, type, body);
  }

  public async fetchArray<T>(
    url: string,
    type: ClassConstructor<T>,
    body?: Record<string, unknown>
  ): Promise<T[]> {
    const res = await crossFetch(url, {
      method: body ? "POST" : "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as T[];

    return json.map((x) => plainToClass(type, x));
  }
}

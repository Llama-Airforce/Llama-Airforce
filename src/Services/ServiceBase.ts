import { fetch as crossFetch } from "cross-fetch";
import { ClassConstructor, plainToClass } from "class-transformer";

export const hostDev = "https://localhost:7019";
export const hostProd = "https://api.llama.airforce/";

export async function fetch<T>(
  url: string,
  type: ClassConstructor<T>,
  body?: Record<string, unknown>
): Promise<T> {
  const res = await crossFetch(url, {
    method: body ? "POST" : "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as T;

  return plainToClass(type, json);
}

export async function fetchText(
  url: string,
  body?: Record<string, unknown>
): Promise<string> {
  const res = await crossFetch(url, {
    method: body ? "POST" : "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return await res.text();
}

export default class ServiceBase {
  public readonly host: string;

  constructor(host: string) {
    this.host = host;
  }

  public async fetch<T>(
    url: string,
    type: ClassConstructor<T>,
    body?: Record<string, unknown>
  ): Promise<T> {
    return fetch(url, type, body);
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

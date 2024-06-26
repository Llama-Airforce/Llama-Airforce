/**
 * Performs a fetch operation with error handling and custom configurations.
 *
 * @param url - The URL to fetch from.
 * @param body - Optional request body for POST requests.
 * @param signal - Optional AbortSignal to abort the fetch request.
 * @returns A Promise that resolves to the Response object.
 * @throws Error if the fetch fails or returns a non-2xx status code.
 */
async function fetchWork(
  url: string,
  body?: Record<string, unknown>,
  signal?: AbortSignal
): Promise<Response> {
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
      throw new Error(`Fetch error ${resp.status} for URL: ${url}`);
    } else {
      return resp;
    }
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error(`Unknown fetch error`);
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
 */
export async function fetchType<T>(
  url: string,
  body?: Record<string, unknown>,
  signal?: AbortSignal
): Promise<T> {
  const res = await fetchWork(url, body, signal);
  const json = (await res.json()) as T;

  return json;
}

/**
 * Fetches data from a URL and returns the response as text.
 *
 * @param url - The URL to fetch from.
 * @param body - Optional request body for POST requests.
 * @param signal - Optional AbortSignal to abort the fetch request.
 * @returns A Promise that resolves to the response text.
 */
export async function fetchText(
  url: string,
  body?: Record<string, unknown>,
  signal?: AbortSignal
): Promise<string> {
  const res = await fetchWork(url, body, signal);
  const text = await res.text();

  return text;
}

/** Base class for services that need to make HTTP requests. */
export class ServiceBase {
  /**
   * Fetches data from a URL and parses the response as JSON.
   * @template T - The expected type of the parsed JSON data.
   * @param url - The URL to fetch from.
   * @param body - Optional request body for POST requests.
   * @param signal - Optional AbortSignal to abort the fetch request.
   * @returns A Promise that resolves to the parsed JSON data of type T.
   */
  public async fetch<T>(
    url: string,
    body?: Record<string, unknown>,
    signal?: AbortSignal
  ): Promise<T> {
    return fetchType<T>(url, body, signal);
  }
}

/** Extended base class for services that require a (single) host. */
export class ServiceBaseHost extends ServiceBase {
  private readonly host: Promise<string>;

  /**
   * Creates an instance of ServiceBaseHost.
   * @param host - A Promise that resolves to the host string.
   */
  constructor(host: Promise<string>) {
    super();
    this.host = host;
  }

  /**
   * Retrieves the host string.
   * @returns A Promise that resolves to the host string.
   */
  protected async getHost(): Promise<string> {
    return await this.host;
  }
}

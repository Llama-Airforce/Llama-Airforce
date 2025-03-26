/**
 * Converts a Record of string key-value pairs to a URL query string.
 * Ignores keys with null or undefined values, automatically converting other values to strings.
 */
export const addQueryString = (
  params: Record<string, string | number | boolean | null | undefined>
) => {
  const query = new URLSearchParams(
    Object.entries(params)
      // eslint-disable-next-line eqeqeq, @typescript-eslint/no-unused-vars
      .filter(([_, value]) => value != null)
      .map(([key, value]) => [key, value!.toString()])
  ).toString();
  return query && `?${query}`;
};

export class FetchError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/**
 * Performs a fetch request and returns the Response object.
 *
 * @param url - The URL to fetch from.
 * @param body - Optional request body for POST requests.
 * @param signal - Optional AbortSignal to abort the fetch request.
 * @returns A Promise that resolves to the Response object.
 * @throws FetchError if the response status is not in the 2xx range.
 */
async function fetchWork(
  url: string,
  body?: Record<string, unknown>,
  signal?: AbortSignal
): Promise<Response> {
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
    // Make the promise be rejected if we didn't get a 2xx response
    throw new FetchError(
      resp.status,
      `Fetch error ${resp.status} for URL: ${url}`
    );
  }

  return resp;
}

/**
 * Fetches data from a URL and parses the response as JSON.
 *
 * @template T - The expected type of the parsed JSON data.
 * @param url - The URL to fetch from.
 * @param body - Optional request body for POST requests.
 * @param signal - Optional AbortSignal to abort the fetch request.
 * @returns A Promise that resolves to the parsed JSON data of type T.
 * @throws FetchError if the response status is not in the 2xx range.
 */
export async function fetchJson<T>(
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
 * @throws FetchError if the response status is not in the 2xx range.
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

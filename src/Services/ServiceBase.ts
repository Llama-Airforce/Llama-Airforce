import { fetchJson } from "@/Utils/fetch";

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
    return fetchJson<T>(url, body, signal);
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

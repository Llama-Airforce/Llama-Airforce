/**
 * Options for making API requests
 * @example
 * const options: Options = {
 *   host: "http://localhost:3000", // Custom host for local testing
 *   signal: new AbortController().signal // For request cancellation
 * }
 */
export type Options = {
  host?: string;
  signal?: AbortSignal;
};

/**
 * Gets the API host URL, using the provided host or falling back to default
 * @param options - Optional configuration options
 * @returns Promise that resolves to the host URL
 * @example
 * const host = getHost() // "https://api.hippo.army"
 */
export const getHost = (options?: Options): Required<Options>["host"] =>
  options?.host ?? "https://api.hippo.army";

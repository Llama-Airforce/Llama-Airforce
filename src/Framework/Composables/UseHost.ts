import { hosts } from "@/Services/Hosts";

const hostDev = "http://localhost:3000";
const hostProd = hosts.laf;

let cachedHost: string | null = null;

/**
 * A composable function that returns the appropriate API host based on the current environment.
 *
 * This function checks if the application is running in development mode and attempts to connect
 * to a local development server. If the local server is not available or the application is in
 * production mode, it falls back to the production host.
 *
 * The function caches the result to avoid unnecessary network requests on subsequent calls.
 *
 * @param {string} [production] Optional override URL for the production host.
 * @returns {Promise<string>} A promise that resolves to the API host URL.
 */
export async function useHost(production?: string): Promise<string> {
  if (cachedHost) return cachedHost;

  const isDevelopment = useDevelopment();

  if (isDevelopment) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const response = await fetch(hostDev, {
        method: "HEAD",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        cachedHost = hostDev;
      } else {
        cachedHost = production ?? hostProd;
        console.warn(
          "Local development server available but didn't ping back correctly from HEAD, using production host."
        );
      }
    } catch (error) {
      console.warn(
        "Local development server not available, using production host."
      );
      cachedHost = hostProd;
    }
  } else {
    cachedHost = hostProd;
  }

  return cachedHost;
}

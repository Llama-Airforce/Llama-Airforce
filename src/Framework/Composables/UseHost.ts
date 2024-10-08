import { hosts, ports } from "@/Services/Hosts";

/** Cache for storing resolved host URLs. */
const hostCache: Record<string, string> = {};

/** Tracks whether warnings have been issued for specific scenarios to prevent duplicate warnings. */
const hasWarned: Record<string, boolean> = {};

/**
 * Get the default host for a given app.
 *
 * @param {ReturnType<typeof useApp>} app - The app identifier.
 * @returns {string} The default host for the app.
 * @throws {Error} If no host is found for the app.
 */
function getHostDefault(app: ReturnType<typeof useApp>): string {
  const hostDefault = hosts[app];

  if (!hostDefault) {
    notify({
      text: `No host could be found for app '${app}' and no override was given.`,
      type: "error",
    });
    throw new Error(`No host found for app '${app}'`);
  }

  return hostDefault;
}

/**
 * A composable function that returns the appropriate API host based on the current environment.
 *
 * This function checks if the application is running in development mode and attempts to connect
 * to a local development server. If the local server is not available or the application is in
 * production mode, it falls back to the production host or a default host.
 *
 * The function caches the result to avoid unnecessary network requests on subsequent calls.
 *
 * @param {string} [production] Optional override URL for the production host.
 * @returns {Promise<string>} A promise that resolves to the API host URL.
 */
export async function useHost(production?: string): Promise<string> {
  // Use the app id or production URL as host cache key.
  const app = useApp();
  const hostKey = production ?? app;

  // If the host is already cached, return it immediately.
  if (hostCache[hostKey]) {
    return Promise.resolve(hostCache[hostKey]);
  }

  // Attempt to use local development server if in development mode.
  const isDevelopment = useDevelopment();
  const hostProduction = production ?? getHostDefault(app);

  if (isDevelopment) {
    try {
      const hostDev = `http://localhost:${ports[app] ?? 3000}`;

      // Ping the local development server with a timeout.
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 2000);
      const response = await fetch(hostDev, {
        method: "HEAD",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Use local development server if available.
      if (response.ok) {
        hostCache[hostKey] = hostDev;
        return hostDev;
      }

      // If response is not ok, throw to trigger the catch block
      throw new Error("Local server not available");
    } catch {
      // Ignore the error and proceed to use the default or production host.
      if (!hasWarned[hostProduction]) {
        notify({
          text: `Local development server not available, using (production) host: ${hostProduction}`,
          type: "warn",
        });

        hasWarned[hostProduction] = true;
      }
    }
  }

  // Use production or default host
  hostCache[hostKey] = hostProduction;

  return hostCache[hostKey];
}

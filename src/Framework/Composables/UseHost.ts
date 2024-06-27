import { hosts } from "@/Services/Hosts";

const hostDev = "http://localhost:3000";
const hostCache: Record<string, string> = {};

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
  if (isDevelopment) {
    try {
      // Ping the local development server with a timeout.
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
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
    } catch (error) {
      // Ignore the error and proceed to use the default or production host.
    }
  }

  /*
   * If not in development or the local server is not available,
   * use the default host if no production overrride was given.
   */
  hostCache[hostKey] = production ?? getHostDefault(app);
  notify({
    text: `Local development server not available, using (production) host: ${hostCache[hostKey]}`,
    type: "warn",
  });

  return hostCache[hostKey];
}

import { hosts } from "@/Services/Hosts";

const hostDev = "http://localhost:3000";

/**
 * A composable function that returns the appropriate API host based on the current environment.
 *
 * @returns {string} The API host URL.
 */
export function useHost(): string {
  const isDevelopment = useDevelopment();

  return isDevelopment ? hostDev : hosts.laf;
}

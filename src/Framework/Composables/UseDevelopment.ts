/**
 * A composable function to determine if the application is running in development mode.
 *
 * This function checks the environment mode and returns a boolean indicating whether
 * the application is currently in development mode. This check only works in the front-end.
 *
 * @returns {boolean} - True if the application is in development mode, false otherwise.
 */
export function useDevelopment() {
  return import.meta.env.MODE === "development";
}

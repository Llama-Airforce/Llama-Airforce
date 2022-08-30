export function isDevelopment(): boolean {
  return import.meta.env.MODE === "development";
}

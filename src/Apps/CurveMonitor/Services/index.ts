export type Options = {
  host?: Promise<string>;
  signal?: AbortSignal;
};

export const getHost = (options?: Options): Required<Options>["host"] =>
  options?.host ?? Promise.resolve("https://prices.curve.fi");

export function toUTC(timestamp: string | number): number {
  if (typeof timestamp === "number") {
    return timestamp;
  }

  const parsed = Number(timestamp);
  if (!Number.isNaN(parsed)) {
    return parsed;
  }

  const [date, time] = timestamp.split("T");
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute, second] = time.split(":").map(Number);

  return Date.UTC(year, month - 1, day, hour, minute, second) / 1000;
}

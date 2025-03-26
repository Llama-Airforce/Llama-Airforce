const TIME_UNITS = [
  { unit: "year", seconds: 365 * 24 * 60 * 60 },
  { unit: "month", seconds: 30 * 24 * 60 * 60 },
  { unit: "week", seconds: 7 * 24 * 60 * 60 },
  { unit: "day", seconds: 24 * 60 * 60 },
  { unit: "hour", seconds: 60 * 60 },
  { unit: "minute", seconds: 60 },
  { unit: "second", seconds: 1 },
];

export function relativeTime(now: Ref<number>, unixtime: number): string {
  const secondsDiff = Math.round(now.value / 1000) - unixtime;

  if (secondsDiff === 0) return "just now";

  const isPast = secondsDiff > 0;
  const absoluteSeconds = Math.abs(secondsDiff);

  for (const { unit, seconds } of TIME_UNITS) {
    if (absoluteSeconds >= seconds) {
      const value = Math.round(absoluteSeconds / seconds);
      return isPast
        ? `${value} ${value === 1 ? unit : unit + "s"} ago`
        : `in ${value} ${value === 1 ? unit : unit + "s"}`;
    }
  }

  return isPast ? "just now" : "in a moment";
}

import { type Ref } from "vue";

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
  const secondsPast = Math.round(now.value / 1000) - unixtime;

  for (const { unit, seconds } of TIME_UNITS) {
    if (secondsPast >= seconds) {
      const value = Math.round(secondsPast / seconds);
      return `${value} ${value === 1 ? unit : unit + "s"} ago`;
    }
  }

  return "just now";
}

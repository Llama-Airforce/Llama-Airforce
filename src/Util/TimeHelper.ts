import { type Ref } from "vue";

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60;
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24;
const SECONDS_IN_WEEK = SECONDS_IN_DAY * 7;
const SECONDS_IN_MONTH = SECONDS_IN_DAY * 30;
const SECONDS_IN_YEAR = SECONDS_IN_DAY * 365;

export function relativeTime(now: Ref<number>, unixtime: number): string {
  const nowUnixTime = Math.round(now.value / 1000);
  const secondsPast = nowUnixTime - unixtime;

  if (secondsPast < SECONDS_IN_MINUTE) {
    return `${Math.round(secondsPast)} seconds ago`;
  } else if (secondsPast < SECONDS_IN_HOUR) {
    return `${Math.round(secondsPast / SECONDS_IN_MINUTE)} minutes ago`;
  } else if (secondsPast < SECONDS_IN_DAY) {
    return `${Math.round(secondsPast / SECONDS_IN_HOUR)} hours ago`;
  } else if (secondsPast < SECONDS_IN_WEEK) {
    return `${Math.round(secondsPast / SECONDS_IN_DAY)} days ago`;
  } else if (secondsPast < SECONDS_IN_MONTH) {
    return `${Math.round(secondsPast / SECONDS_IN_WEEK)} weeks ago`;
  } else if (secondsPast < SECONDS_IN_YEAR) {
    return `${Math.round(secondsPast / SECONDS_IN_MONTH)} months ago`;
  } else {
    return `${Math.round(secondsPast / SECONDS_IN_YEAR)} years ago`;
  }
}

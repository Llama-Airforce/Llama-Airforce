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
    const seconds = Math.round(secondsPast);
    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
  } else if (secondsPast < SECONDS_IN_HOUR) {
    const minutes = Math.round(secondsPast / SECONDS_IN_MINUTE);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (secondsPast < SECONDS_IN_DAY) {
    const hours = Math.round(secondsPast / SECONDS_IN_HOUR);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (secondsPast < SECONDS_IN_WEEK) {
    const days = Math.round(secondsPast / SECONDS_IN_DAY);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (secondsPast < SECONDS_IN_MONTH) {
    const weeks = Math.round(secondsPast / SECONDS_IN_WEEK);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (secondsPast < SECONDS_IN_YEAR) {
    const months = Math.round(secondsPast / SECONDS_IN_MONTH);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.round(secondsPast / SECONDS_IN_YEAR);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
}

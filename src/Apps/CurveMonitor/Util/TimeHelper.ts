import { Ref } from "vue";

export function relativeTime(now: Ref<number>, unixtime: number): string {
  const nowUnixTime = Math.round(now.value / 1000);
  const secondsPast = nowUnixTime - unixtime;

  if (secondsPast < 60) {
    return `${Math.round(secondsPast)} seconds ago`;
  } else if (secondsPast < 60 * 60) {
    return `${Math.round(secondsPast / 60)} minutes ago`;
  } else if (secondsPast < 60 * 60 * 24) {
    return `${Math.round(secondsPast / (60 * 60))} hours ago`;
  } else {
    return `${Math.round(secondsPast / (60 * 60 * 24))} days ago`;
  }
}

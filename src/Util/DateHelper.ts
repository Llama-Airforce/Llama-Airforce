export function toUnixSeconds(date: Date): number {
  return Math.round(date.getTime() / 1000);
}

export function addDays(date: Date, days: number): Date {
  const newDate = new Date(date.valueOf());
  newDate.setUTCDate(newDate.getUTCDate() + days);
  return newDate;
}

export function countdown(date: Date): string {
  function pad(n: number): string {
    return n < 10 ? "0" + n.toString() : n.toString();
  }

  const diff = date.getTime() - new Date().getTime();

  if (diff <= 0) {
    return "00:00:00:00";
  }

  const _second = 1000;
  const _minute = _second * 60;
  const _hour = _minute * 60;
  const _day = _hour * 24;

  const days = Math.floor(diff / _day);
  const hours = Math.floor((diff % _day) / _hour);
  const minutes = Math.floor((diff % _hour) / _minute);
  const seconds = Math.floor((diff % _minute) / _second);

  return pad(days) + ":" + pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
}

export function toUTC(timestamp: string): number {
  const [date, time] = timestamp.split("T");
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute, second] = time.split(":").map(Number);

  return Date.UTC(year, month - 1, day, hour, minute, second) / 1000;
}

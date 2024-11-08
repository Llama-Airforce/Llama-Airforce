import { relativeTime as relativeTimeFunc } from "@/Utils/TimeHelper";

/**
 * Vue composable that provides a function to get the relative time string from a given Unix timestamp.
 *
 * @returns An object containing the `relativeTime` function.
 * - `relativeTime`: A function that takes a Unix timestamp as input and returns a string representing the relative time since now.
 *
 * @example
 * ```
 * const { relativeTime } = useRelativeTime();
 * const timeString = relativeTime(1621234567); // Returns a string like "2 hours ago"
 * ```
 */
export function useRelativeTime() {
  const now = ref(Date.now());

  onMounted(() => {
    setInterval(() => {
      now.value = Date.now();
    });
  });

  const relativeTime = (unixtime: number): string => {
    return relativeTimeFunc(now, unixtime);
  };

  return { relativeTime };
}

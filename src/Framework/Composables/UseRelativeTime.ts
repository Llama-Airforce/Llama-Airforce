import { ref, onMounted } from "vue";
import { relativeTime as relativeTimeFunc } from "@/Util/TimeHelper";

/** Vue composable that returns a function that returns a string of time since now. */
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

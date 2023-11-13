import { ref, type Ref, onUnmounted } from "vue";
import { type Observable } from "rxjs";
import { notify } from "@kyvg/vue3-notification";

/**
 * Vue composable that transforms an observale into a Vue 3 ref.
 * Unsubscribes on unmount.
 * Shows error notification on error.
 *
 * @param obs The observable to turn into a Vue 3 ref.
 * @param init The default / init value of the data before the first data arrives.
 */
export function useObservable<T>(obs: Observable<T>, init: T): Ref<T> {
  const obsRef = ref(init) as Ref<T>;

  const subscription = obs.subscribe({
    next: (x) => {
      obsRef.value = x;
    },
    error: (err) => {
      const text = err instanceof Error ? err.message : JSON.stringify(err);
      notify({ text, type: "error" });
    },
  });

  onUnmounted(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  return obsRef;
}

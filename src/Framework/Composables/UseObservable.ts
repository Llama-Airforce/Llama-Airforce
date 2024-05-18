import { type Observable } from "rxjs";
import { notify } from "@kyvg/vue3-notification";

/**
 * Vue composable that transforms an RxJS Observable into a reactive Vue 3 ref.
 *
 * @param {Observable<T>} obs - The RxJS Observable to be transformed into a Vue ref.
 * @param {T} init - The initial value of the ref before the first value is emitted by the Observable.
 * @returns {Ref<T>} A Vue ref that holds the latest value emitted by the Observable.
 *
 * @description
 * This composable function subscribes to the provided Observable and updates the returned Vue ref
 * whenever a new value is emitted. It automatically unsubscribes from the Observable when the
 * associated Vue component is unmounted to prevent memory leaks.
 *
 * If an error is emitted by the Observable, it will be displayed as a notification using the
 * `@kyvg/vue3-notification` library.
 *
 * @example
 * ```
 * const count$ = new BehaviorSubject(0);
 * const count = useObservable(count$, 0);
 * ```
 */
export function useObservable<T>(obs: Observable<T>, init: T): Ref<T> {
  const obsRef = ref(init) as Ref<T>;

  const subscription = obs.subscribe({
    next: (x) => {
      obsRef.value = x;
    },
    error: (err) => {
      const text =
        err instanceof Error ? prettyError(err) : JSON.stringify(err);

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

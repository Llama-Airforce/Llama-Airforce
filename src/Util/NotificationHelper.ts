import { type Ref } from "vue";
import { notify } from "@kyvg/vue3-notification";

/**
 * Calls a function that might throw, and shows caught exceptions as notifications.
 * @param f The function to call that might throw.
 */
export async function tryNotify<T>(
  f: () => Promise<T>
): Promise<T | undefined> {
  try {
    return await f();
  } catch (err: unknown) {
    if (err instanceof Error) {
      notify({ text: err.message, type: "error" });
    }

    return undefined;
  }
}

/**
 * Calls a function that might throw, and shows caught exceptions as notifications.
 * @param ref The loading Ref to set to true or false while executing the promise.
 * @param f The function to call that might throw.
 */
export async function tryNotifyLoading<T>(
  ref: Ref<boolean>,
  f: () => Promise<T>
): Promise<T | undefined> {
  ref.value = true;

  try {
    return await f();
  } catch (err: unknown) {
    if (err instanceof Error) {
      notify({ text: err.message, type: "error" });
    }

    return undefined;
  } finally {
    ref.value = false;
  }
}

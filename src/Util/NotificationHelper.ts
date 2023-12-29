import { type Ref } from "vue";
import { notify } from "@kyvg/vue3-notification";

export function prettyError(err: Error): string {
  if (
    err.message.includes("Exchange resulted in fewer coins than expected") ||
    err.message.includes("Slippage")
  ) {
    return "Transaction failed because slippage was set too low. A slight increase of one or two percent could help, but don't make it too high to ensure your protection. We also highly recommend using MEVBlocker for extra safety.";
  }

  return err.message;
}

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
    const text = err instanceof Error ? prettyError(err) : JSON.stringify(err);
    notify({ text, type: "error" });

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
    const text = err instanceof Error ? prettyError(err) : JSON.stringify(err);
    notify({ text, type: "error" });

    return undefined;
  } finally {
    ref.value = false;
  }
}

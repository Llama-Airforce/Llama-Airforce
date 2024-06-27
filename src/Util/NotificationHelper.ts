import { type Ref } from "vue";

/**
 * Formats an error message for user-friendly display.
 * @param err The error to format.
 * @returns A formatted error message string.
 */
export function prettyError(err: unknown): string {
  if (!(err instanceof Error)) {
    return JSON.stringify(err);
  }

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
    notify({ text: prettyError(err), type: "error" });

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
    notify({ text: prettyError(err), type: "error" });

    return undefined;
  } finally {
    ref.value = false;
  }
}

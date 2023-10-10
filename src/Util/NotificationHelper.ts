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

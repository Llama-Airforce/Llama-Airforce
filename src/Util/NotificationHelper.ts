import { notify } from "@kyvg/vue3-notification";

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

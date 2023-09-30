import { type LazyArg, pipe } from "fp-ts/function";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";

export function toTE<A>(f: LazyArg<A>) {
  return TE.tryCatch(T.fromIO(f), (e) =>
    e instanceof Error ? e : new Error("Unknown error")
  );
}

export function taskToTE<A>(f: LazyArg<Promise<A>>) {
  return TE.tryCatch(f, (e) =>
    e instanceof Error ? e : new Error("Unknown error")
  );
}

/**
 * Chains the TE only when it evaluates to the left side of a TE.
 * @param f Function that maps E into TE<E, A>, ony called when ma is Left.
 * @returns A function ready to be used in TE.chain.
 */
export function chainLeft<E, A>(
  f: (e: E) => TE.TaskEither<E, A>
): (ma: TE.TaskEither<E, A>) => TE.TaskEither<E, A> {
  return (ma: TE.TaskEither<E, A>) =>
    pipe(
      ma,
      TE.swap,
      /*
       * Chaining f into the swapped TE means it only applies f if it were originally left.
       * f returns TE<E, A>, so it must be swapped to TE<A, E> so chain compiles.
       */
      TE.chain((a) => pipe(a, f, TE.swap)),
      TE.swap // Undo swapping.
    );
}

/** Helper function for logging in pipes. */
export function log<T>(msg: string): (x: T) => T {
  return (x: T): T => {
    console.log(msg);
    return x;
  };
}

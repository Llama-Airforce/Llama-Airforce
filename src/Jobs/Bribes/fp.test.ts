import { test, describe, expect } from "vitest";
import dotenv from "dotenv";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import { chainLeft } from "@/Jobs/Bribes/fp";

dotenv.config({ path: "./.env" });

describe("FP", () => {
  describe("chainLeft", () => {
    test("don't map right", async () => {
      const x = TE.right<Error, number>(1);
      const y = await pipe(
        x,
        chainLeft(() => TE.right<Error, number>(2)),
        TE.match(
          () => 0,
          (r) => r
        )
      )();

      expect(y).toEqual(1);
    });

    test("map left", async () => {
      const x = TE.left<Error, number>(new Error("yolo"));
      const y = await pipe(
        x,
        chainLeft(() => TE.right<Error, number>(2)),
        TE.match(
          () => 0,
          (r) => r
        )
      )();

      expect(y).toEqual(2);
    });
  });
});

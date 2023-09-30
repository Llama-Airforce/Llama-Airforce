import { test, describe, expect } from "vitest";
import dotenv from "dotenv";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { getPrice } from "@/Jobs/Bribes/DefiLlama";

dotenv.config({ path: "./.env" });

describe("DefiLlama", () => {
  test("getPrice", async () => {
    const price = await pipe(
      getPrice(
        "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b",
        "ethereum",
        new Date(Date.UTC(2021, 9, 19, 0, 1, 30))
      ),
      TE.match(
        (l) => {
          throw l;
        },
        (r) => r
      )
    )();

    expect(price).toEqual(14.58121824457324);
  });
});

import { describe, expect, test } from "vitest";
import type { Epoch } from "@LAF/Pages/Bribes/Models";
import {
  getBribed,
  getFinishedDateRaw,
  ONCHAIN_GAUGE_VOTING_OVERTIME_SECONDS,
} from "@LAF/Pages/Bribes/Util/EpochHelper";

describe("EpochHelper", () => {
  describe("getFinishedDateRaw", () => {
    test("uses the raw proposal end for Snapshot rounds", () => {
      expect(
        getFinishedDateRaw({
          proposal: "snapshot-proposal",
          end: 1000,
          voteSource: "snapshot",
        }).getTime()
      ).toBe(1000 * 1000);
    });

    test("adds gauge overtime for Convex on-chain rounds", () => {
      expect(
        getFinishedDateRaw({
          proposal: "0",
          end: 1000,
          voteSource: "convex-onchain",
        }).getTime()
      ).toBe((1000 + ONCHAIN_GAUGE_VOTING_OVERTIME_SECONDS) * 1000);
    });
  });

  describe("getBribed", () => {
    test("ignores pools with bribes but zero vote weight", () => {
      const epoch: Epoch = {
        platform: "votium",
        protocol: "cvx-crv",
        round: 130,
        proposal: "0",
        voteSource: "convex-onchain",
        end: 0,
        bribed: {
          "pool-a": 1000,
          "pool-zero": 0,
        },
        bribes: [
          {
            pool: "pool-a",
            token: "CVX",
            amount: 100,
            amountDollars: 200,
          },
          {
            pool: "pool-zero",
            token: "CVX",
            amount: 100,
            amountDollars: 500,
          },
        ],
      };

      expect(getBribed(epoch).map((bribe) => bribe.pool)).toEqual(["pool-a"]);
    });
  });
});

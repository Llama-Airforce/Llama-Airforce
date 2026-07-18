import { describe, expect, test } from "vitest";
import type { VoteSource } from "@LAF/Pages/Bribes/Models";
import { getVoteSource } from "@LAF/Pages/Bribes/Util/VoteSource";

describe("VoteSource", () => {
  test("defaults to Snapshot when the backend did not set a vote source", () => {
    expect(getVoteSource({})).toBe("snapshot");
  });

  test.each<VoteSource>(["snapshot", "convex-onchain"])(
    "uses the backend voteSource %s as the authority",
    (voteSource) => {
      expect(getVoteSource({ voteSource })).toBe(voteSource);
    }
  );
});

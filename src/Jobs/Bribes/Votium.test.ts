import { test, describe, expect } from "vitest";
import dotenv from "dotenv";
import { getEpochs } from "@/Jobs/Bribes/Votium";

dotenv.config({ path: "./.env" });

describe("Votium Subgraph", () => {
  test("getEpochs", async () => {
    const epochs = await getEpochs();

    expect(epochs.every((epoch) => epoch.round > 51)).toBe(true);
    expect(epochs.find((epoch) => epoch.round === 52)?.bribes.length).toBe(3);
  });
});

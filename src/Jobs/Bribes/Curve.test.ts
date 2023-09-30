import { test, describe, expect } from "vitest";
import dotenv from "dotenv";
import { getGauges } from "@/Jobs/Bribes/Curve";

dotenv.config({ path: "./.env" });

describe("Curve API", () => {
  test("getGauges", async () => {
    const gauges = await getGauges();

    const mimAddr = "0x4792b8845e4d7e18e104b535d81b6904d72915a4";
    const mimPoolName = "MIM+FRAXBP (0xb3bC…)";

    expect(gauges[mimAddr].shortName).toEqual(mimPoolName);
  });
});

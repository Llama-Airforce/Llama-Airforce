/* eslint-disable max-lines-per-function */
import { test, describe, expect } from "vitest";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

describe("Vitest", () => {
  test("Vitest should not fail because 'no tests given'", () => {
    expect(true).toBe(true);
  });
});

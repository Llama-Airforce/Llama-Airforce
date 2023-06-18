import { defineConfig } from "vitest/config";

console.log(__dirname);

export default defineConfig({
  test: {
    includeSource: ["src/Apps/LlamaAirforce/**/*.test.ts"],
    setupFiles: "dotenv/config", // load variables form .env file
  },
  resolve: {
    alias: [
      { find: "@", replacement: "src" },
      {
        find: "@LAF",
        replacement: "src/Apps/LlamaAirforce",
      },
      {
        find: "@Union",
        replacement: "src/Apps/LlamaAirforce/Pages/Union",
      },
    ],
  },
});

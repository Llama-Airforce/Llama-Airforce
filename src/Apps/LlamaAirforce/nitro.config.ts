import { type NitroRuntimeConfig } from "nitropack";
import { defineNitroConfig } from "nitropack/config";
import { resolve } from "path";

const runtimeConfig = {
  dbEndpoint: process.env.DB_ENDPOINT,
  dbKey: process.env.DB_KEY,
};

export type RuntimeConfig = {
  [K in keyof typeof runtimeConfig]: NonNullable<(typeof runtimeConfig)[K]>;
} & NitroRuntimeConfig;

export default defineNitroConfig({
  srcDir: resolve(__dirname, "Server"),
  runtimeConfig,
  alias: {
    "@LAF/Server": "~/",
  },
});

import { type NitroRuntimeConfig } from "nitropack";
import { defineNitroConfig } from "nitropack/config";
import { resolve } from "path";

const runtimeConfig = {
  dbEndpoint: process.env.DB_ENDPOINT,
  dbKey: process.env.DB_KEY,
  clearCachePassword: process.env.CLEAR_CACHE_PASSWORD,
  alchemyLAF: process.env.NITRO_LAF_ALCHEMY,
};

export type RuntimeConfig = {
  [K in keyof typeof runtimeConfig]: NonNullable<(typeof runtimeConfig)[K]>;
} & NitroRuntimeConfig;

export default defineNitroConfig({
  rootDir: __dirname,
  srcDir: resolve(__dirname, "Server"),
  runtimeConfig,
  alias: {
    "@": resolve(__dirname, "../../"),
    "@LAF": resolve(__dirname, "./"),
  },
});
